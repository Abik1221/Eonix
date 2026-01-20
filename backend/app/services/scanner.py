"""
Enhanced file scanner for repository analysis.
Provides intelligent file walking with ignore patterns and statistics collection.
"""

import os
from pathlib import Path
from typing import List, Set, Dict, Optional
from dataclasses import dataclass
from enum import Enum


class FileCategory(str, Enum):
    """File categories for processing"""
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    JAVA = "java"
    GO = "go"
    CONFIG = "config"
    UNKNOWN = "unknown"


@dataclass
class FileInfo:
    """Information about a scanned file"""
    path: str
    relative_path: str
    extension: str
    category: FileCategory
    size_bytes: int
    
    
@dataclass
class ScanStatistics:
    """Statistics collected during repository scan"""
    total_files: int
    total_size_bytes: int
    files_by_category: Dict[FileCategory, int]
    files_by_extension: Dict[str, int]
    directories_scanned: int
    directories_ignored: int


# Directories to ignore during scanning
IGNORED_DIRS: Set[str] = {
    # Version control
    ".git", ".svn", ".hg", ".bzr",
    
    # Dependencies
    "node_modules", "bower_components",
    
    # Python
    "venv", "env", ".venv", ".env",
    "__pycache__", ".pytest_cache", ".mypy_cache",
    "*.egg-info", ".eggs",
    
    # Build outputs
    "dist", "build", "target", "out",
    ".next", ".nuxt", ".output",
    "bin", "obj",
    
    # IDEs
    ".idea", ".vscode", ".vs",
    ".eclipse", ".settings",
    
    # OS
    ".DS_Store", "Thumbs.db",
    
    # Other
    "coverage", ".coverage", "htmlcov",
    ".tox", ".nox",
}

# File patterns to ignore
IGNORED_FILE_PATTERNS: Set[str] = {
    ".pyc", ".pyo", ".pyd",
    ".class", ".jar", ".war",
    ".so", ".dylib", ".dll",
    ".exe", ".dmg", ".pkg",
    ".log", ".tmp", ".temp",
    ".swp", ".swo",
    ".DS_Store", "Thumbs.db",
}

# Extension to category mapping
EXTENSION_CATEGORY_MAP: Dict[str, FileCategory] = {
    ".py": FileCategory.PYTHON,
    ".pyi": FileCategory.PYTHON,
    
    ".js": FileCategory.JAVASCRIPT,
    ".jsx": FileCategory.JAVASCRIPT,
    ".mjs": FileCategory.JAVASCRIPT,
    ".cjs": FileCategory.JAVASCRIPT,
    
    ".ts": FileCategory.TYPESCRIPT,
    ".tsx": FileCategory.TYPESCRIPT,
    
    ".java": FileCategory.JAVA,
    
    ".go": FileCategory.GO,
    
    ".json": FileCategory.CONFIG,
    ".yaml": FileCategory.CONFIG,
    ".yml": FileCategory.CONFIG,
    ".toml": FileCategory.CONFIG,
    ".ini": FileCategory.CONFIG,
    ".xml": FileCategory.CONFIG,
}


class RepositoryScanner:
    """
    Intelligent repository scanner with ignore patterns and statistics.
    
    NO AI. NO RUNTIME. Just file system traversal.
    """
    
    def __init__(self, additional_ignores: Optional[Set[str]] = None):
        """
        Initialize scanner with optional additional ignore patterns.
        
        Args:
            additional_ignores: Additional directory names to ignore
        """
        self.ignored_dirs = IGNORED_DIRS.copy()
        if additional_ignores:
            self.ignored_dirs.update(additional_ignores)
        
        self.stats = ScanStatistics(
            total_files=0,
            total_size_bytes=0,
            files_by_category={cat: 0 for cat in FileCategory},
            files_by_extension={},
            directories_scanned=0,
            directories_ignored=0,
        )
    
    def scan(self, repo_path: str) -> List[FileInfo]:
        """
        Scan repository and return list of files to process.
        
        Args:
            repo_path: Path to repository root
            
        Returns:
            List of FileInfo objects for processable files
        """
        repo_path = os.path.abspath(repo_path)
        files: List[FileInfo] = []
        
        for root, dirs, filenames in os.walk(repo_path):
            # In-place filter to prevent descending into ignored directories
            original_dir_count = len(dirs)
            dirs[:] = [d for d in dirs if not self._should_ignore_directory(d)]
            self.stats.directories_ignored += (original_dir_count - len(dirs))
            self.stats.directories_scanned += len(dirs)
            
            for filename in filenames:
                if self._should_process_file(filename):
                    file_path = os.path.join(root, filename)
                    relative_path = os.path.relpath(file_path, repo_path)
                    
                    try:
                        file_info = self._create_file_info(
                            file_path,
                            relative_path,
                            filename
                        )
                        files.append(file_info)
                        self._update_stats(file_info)
                    except (OSError, IOError) as e:
                        # Skip files that can't be read
                        print(f"Warning: Cannot read {file_path}: {e}")
                        continue
        
        self.stats.total_files = len(files)
        return files
    
    def _should_ignore_directory(self, dirname: str) -> bool:
        """Check if directory should be ignored"""
        # Check against ignored directory set
        if dirname in self.ignored_dirs:
            return True
        
        # Check for hidden directories (except .github for CI configs)
        if dirname.startswith('.') and dirname not in {'.github', '.gitlab'}:
            return True
        
        return False
    
    def _should_process_file(self, filename: str) -> bool:
        """Check if file should be processed"""
        # Ignore hidden files
        if filename.startswith('.') and filename not in {'.env.example'}:
            return False
        
        # Check against ignored patterns
        for pattern in IGNORED_FILE_PATTERNS:
            if filename.endswith(pattern):
                return False
        
        # Only process files with recognized extensions
        ext = self._get_extension(filename)
        return ext in EXTENSION_CATEGORY_MAP
    
    def _get_extension(self, filename: str) -> str:
        """Get file extension in lowercase"""
        return os.path.splitext(filename)[1].lower()
    
    def _create_file_info(
        self,
        file_path: str,
        relative_path: str,
        filename: str
    ) -> FileInfo:
        """Create FileInfo object for a file"""
        ext = self._get_extension(filename)
        category = EXTENSION_CATEGORY_MAP.get(ext, FileCategory.UNKNOWN)
        size = os.path.getsize(file_path)
        
        return FileInfo(
            path=file_path,
            relative_path=relative_path,
            extension=ext,
            category=category,
            size_bytes=size,
        )
    
    def _update_stats(self, file_info: FileInfo) -> None:
        """Update scan statistics"""
        self.stats.total_size_bytes += file_info.size_bytes
        self.stats.files_by_category[file_info.category] += 1
        
        ext = file_info.extension
        self.stats.files_by_extension[ext] = \
            self.stats.files_by_extension.get(ext, 0) + 1
    
    def load_eonixignore(self, repo_path: str) -> None:
        """
        Load .eonixignore file if it exists and add patterns.
        
        Format similar to .gitignore:
        - One pattern per line
        - # for comments
        - Blank lines ignored
        """
        ignore_file = os.path.join(repo_path, '.eonixignore')
        
        if not os.path.exists(ignore_file):
            return
        
        try:
            with open(ignore_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    # Skip comments and empty lines
                    if not line or line.startswith('#'):
                        continue
                    # Add to ignored directories
                    self.ignored_dirs.add(line)
        except (OSError, IOError) as e:
            print(f"Warning: Cannot read .eonixignore: {e}")
    
    def get_statistics(self) -> ScanStatistics:
        """Get current scan statistics"""
        return self.stats
    
    def print_statistics(self) -> None:
        """Print scan statistics in human-readable format"""
        print("\n📊 Repository Scan Statistics")
        print("=" * 50)
        print(f"Total files: {self.stats.total_files}")
        print(f"Total size: {self._format_bytes(self.stats.total_size_bytes)}")
        print(f"Directories scanned: {self.stats.directories_scanned}")
        print(f"Directories ignored: {self.stats.directories_ignored}")
        
        print("\n📁 Files by Category:")
        for category, count in sorted(
            self.stats.files_by_category.items(),
            key=lambda x: x[1],
            reverse=True
        ):
            if count > 0:
                print(f"  {category.value}: {count}")
        
        print("\n📄 Files by Extension:")
        for ext, count in sorted(
            self.stats.files_by_extension.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]:  # Top 10
            print(f"  {ext}: {count}")
    
    @staticmethod
    def _format_bytes(bytes_count: int) -> str:
        """Format byte count as human-readable string"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes_count < 1024.0:
                return f"{bytes_count:.1f} {unit}"
            bytes_count /= 1024.0
        return f"{bytes_count:.1f} TB"


def scan_repository(
    repo_path: str,
    with_stats: bool = True,
    additional_ignores: Optional[Set[str]] = None
) -> List[FileInfo]:
    """
    Convenience function to scan a repository.
    
    Args:
        repo_path: Path to repository
        with_stats: Whether to print statistics
        additional_ignores: Additional patterns to ignore
        
    Returns:
        List of FileInfo objects
    """
    scanner = RepositoryScanner(additional_ignores)
    scanner.load_eonixignore(repo_path)
    
    files = scanner.scan(repo_path)
    
    if with_stats:
        scanner.print_statistics()
    
    return files
