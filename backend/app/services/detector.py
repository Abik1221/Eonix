"""
Language and framework detection for repositories.
Deterministic detection based on config files, imports, and code patterns.

NO AI. Just file and pattern matching.
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Set, Optional
from dataclasses import dataclass
from enum import Enum


class Language(str, Enum):
    """Supported programming languages"""
    PYTHON = "Python"
    TYPESCRIPT = "TypeScript"
    JAVASCRIPT = "JavaScript"
    JAVA = "Java"
    GO = "Go"
    UNKNOWN = "Unknown"


class ConfidenceLevel(str, Enum):
    """Detection confidence levels"""
    HIGH = "HIGH"      # Config file + imports match
    MEDIUM = "MEDIUM"  # Config file OR imports match
    LOW = "LOW"        # Heuristic/guess


@dataclass
class Framework:
    """Framework detection result"""
    name: str
    version: Optional[str] = None
    confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM
    evidence: List[str] = None
    
    def __post_init__(self):
        if self.evidence is None:
            self.evidence = []


@dataclass
class DetectionResult:
    """Complete language and framework detection result"""
    primary_language: Language
    frameworks: List[Framework]
    languages_detected: Dict[Language, int]  # Language -> file count
    confidence: ConfidenceLevel
    evidence: Dict[str, List[str]]  # What led to detection
    is_monorepo: bool = False
    architecture_type: str = "unknown"  # "monolith", "microservices", "unknown"


class LanguageDetector:
    """
    Detects programming languages and frameworks in a repository.
    Uses config files, imports, and code patterns for detection.
    """
    
    # Config file patterns for languages
    LANGUAGE_CONFIG_PATTERNS = {
        Language.PYTHON: [
            "requirements.txt",
            "pyproject.toml",
            "setup.py",
            "Pipfile",
            "poetry.lock",
        ],
        Language.JAVASCRIPT: [
            "package.json",
        ],
        Language.TYPESCRIPT: [
            "tsconfig.json",
        ],
        Language.JAVA: [
            "pom.xml",
            "build.gradle",
            "build.gradle.kts",
        ],
        Language.GO: [
            "go.mod",
            "go.sum",
        ],
    }
    
    # Framework detection patterns
    FRAMEWORK_PATTERNS = {
        # Python frameworks
        "FastAPI": {
            "import_patterns": [r"from\s+fastapi\s+import", r"import\s+fastapi"],
            "file_patterns": [],
            "language": Language.PYTHON,
        },
        "Flask": {
            "import_patterns": [r"from\s+flask\s+import", r"import\s+flask"],
            "file_patterns": [],
            "language": Language.PYTHON,
        },
        "Django": {
            "import_patterns": [r"from\s+django", r"import\s+django"],
            "file_patterns": ["manage.py", "settings.py"],
            "language": Language.PYTHON,
        },
        "SQLAlchemy": {
            "import_patterns": [r"from\s+sqlalchemy", r"import\s+sqlalchemy"],
            "file_patterns": [],
            "language": Language.PYTHON,
        },
        
        # JavaScript/TypeScript frameworks
        "Express": {
            "import_patterns": [r"require\(['\"]express['\"]\)", r"from\s+['\"]express['\"]"],
            "file_patterns": [],
            "language": Language.JAVASCRIPT,
        },
        "NestJS": {
            "import_patterns": [r"@nestjs/", r"import.*@nestjs"],
            "file_patterns": ["nest-cli.json"],
            "language": Language.TYPESCRIPT,
        },
        "Next.js": {
            "import_patterns": [r"from\s+['\"]next", r"next/"],
            "file_patterns": ["next.config.js", "next.config.ts"],
            "language": Language.TYPESCRIPT,
        },
        "React": {
            "import_patterns": [r"from\s+['\"]react['\"]", r"import\s+React"],
            "file_patterns": [],
            "language": Language.JAVASCRIPT,
        },
        
        # ORMs and Database libraries
        "Prisma": {
            "import_patterns": [r"@prisma/client", r"from\s+['\"]@prisma"],
            "file_patterns": ["schema.prisma"],
            "language": Language.TYPESCRIPT,
        },
        "TypeORM": {
            "import_patterns": [r"from\s+['\"]typeorm['\"]", r"import.*typeorm"],
            "file_patterns": [],
            "language": Language.TYPESCRIPT,
        },
        
        # Java frameworks
        "Spring Boot": {
            "import_patterns": [r"import\s+org\.springframework"],
            "file_patterns": [],
            "language": Language.JAVA,
        },
    }
    
    def __init__(self, repo_path: str):
        """
        Initialize detector for a repository.
        
        Args:
            repo_path: Path to repository root
        """
        self.repo_path = os.path.abspath(repo_path)
        self.evidence: Dict[str, List[str]] = {}
    
    def detect(self) -> DetectionResult:
        """
        Perform full detection on the repository.
        
        Returns:
            DetectionResult with language, frameworks, and confidence
        """
        # Phase 1: Detect languages from config files
        languages_from_config = self._detect_languages_from_config()
        
        # Phase 2: Count files by extension
        languages_from_files = self._count_files_by_language()
        
        # Phase 3: Determine primary language
        primary_language, confidence = self._determine_primary_language(
            languages_from_config,
            languages_from_files
        )
        
        # Phase 4: Detect frameworks
        frameworks = self._detect_frameworks(primary_language)
        
        # Phase 5: Detect architecture type
        is_monorepo = self._is_monorepo()
        architecture_type = self._detect_architecture_type()
        
        return DetectionResult(
            primary_language=primary_language,
            frameworks=frameworks,
            languages_detected=languages_from_files,
            confidence=confidence,
            evidence=self.evidence,
            is_monorepo=is_monorepo,
            architecture_type=architecture_type,
        )
    
    def _detect_languages_from_config(self) -> Set[Language]:
        """Detect languages by checking for config files"""
        detected = set()
        
        for language, config_files in self.LANGUAGE_CONFIG_PATTERNS.items():
            for config_file in config_files:
                if self._file_exists(config_file):
                    detected.add(language)
                    self._add_evidence(
                        f"{language.value}_config",
                        f"Found {config_file}"
                    )
                    break  # One config file is enough
        
        # TypeScript often comes with JavaScript
        if Language.TYPESCRIPT in detected:
            detected.add(Language.JAVASCRIPT)
        
        return detected
    
    def _count_files_by_language(self) -> Dict[Language, int]:
        """Count source files by language based on extensions"""
        counts = {lang: 0 for lang in Language}
        
        extension_map = {
            ".py": Language.PYTHON,
            ".pyi": Language.PYTHON,
            ".js": Language.JAVASCRIPT,
            ".jsx": Language.JAVASCRIPT,
            ".mjs": Language.JAVASCRIPT,
            ".ts": Language.TYPESCRIPT,
            ".tsx": Language.TYPESCRIPT,
            ".java": Language.JAVA,
            ".go": Language.GO,
        }
        
        # Quick scan of source files (limit to avoid performance issues)
        sampled_files = 0
        max_samples = 1000
        
        for root, dirs, files in os.walk(self.repo_path):
            # Skip common non-source directories
            dirs[:] = [d for d in dirs if d not in {
                "node_modules", ".git", "venv", "dist", "build"
            }]
            
            for filename in files:
                ext = os.path.splitext(filename)[1].lower()
                if ext in extension_map:
                    counts[extension_map[ext]] += 1
                    sampled_files += 1
                    
                    if sampled_files >= max_samples:
                        break
            
            if sampled_files >= max_samples:
                break
        
        return counts
    
    def _determine_primary_language(
        self,
        config_languages: Set[Language],
        file_counts: Dict[Language, int]
    ) -> tuple[Language, ConfidenceLevel]:
        """Determine the primary language with confidence level"""
        
        # Remove UNKNOWN from consideration
        file_counts = {
            lang: count for lang, count in file_counts.items()
            if lang != Language.UNKNOWN and count > 0
        }
        
        if not config_languages and not file_counts:
            return Language.UNKNOWN, ConfidenceLevel.LOW
        
        # If we have config files and they match file counts, HIGH confidence
        if config_languages:
            # Sort config languages by file count
            sorted_langs = sorted(
                config_languages,
                key=lambda lang: file_counts.get(lang, 0),
                reverse=True
            )
            
            if sorted_langs:
                primary = sorted_langs[0]
                if file_counts.get(primary, 0) > 0:
                    return primary, ConfidenceLevel.HIGH
                else:
                    return primary, ConfidenceLevel.MEDIUM
        
        # Otherwise, use file count
        if file_counts:
            primary = max(file_counts.items(), key=lambda x: x[1])[0]
            return primary, ConfidenceLevel.MEDIUM
        
        return Language.UNKNOWN, ConfidenceLevel.LOW
    
    def _detect_frameworks(self, primary_language: Language) -> List[Framework]:
        """Detect frameworks for the primary language"""
        frameworks = []
        
        for framework_name, patterns in self.FRAMEWORK_PATTERNS.items():
            # Skip if framework is not for this language
            if patterns["language"] not in {primary_language, Language.UNKNOWN}:
                # Allow some cross-language frameworks
                if primary_language == Language.JAVASCRIPT and patterns["language"] == Language.TYPESCRIPT:
                    pass  # TypeScript frameworks work in JS repos
                else:
                    continue
            
            detected = False
            evidence_list = []
            confidence = ConfidenceLevel.LOW
            
            # Check file patterns
            for file_pattern in patterns["file_patterns"]:
                if self._file_exists(file_pattern):
                    detected = True
                    evidence_list.append(f"Found {file_pattern}")
                    confidence = ConfidenceLevel.HIGH
            
            # Check import patterns in source files
            if not detected or confidence == ConfidenceLevel.LOW:
                import_found = self._search_imports(
                    patterns["import_patterns"],
                    primary_language
                )
                if import_found:
                    detected = True
                    evidence_list.extend(import_found)
                    # Boost confidence if we also had file patterns
                    if confidence == ConfidenceLevel.HIGH:
                        pass  # Already HIGH
                    else:
                        confidence = ConfidenceLevel.MEDIUM
            
            if detected:
                frameworks.append(Framework(
                    name=framework_name,
                    confidence=confidence,
                    evidence=evidence_list,
                ))
                self._add_evidence(
                    f"framework_{framework_name}",
                    evidence_list
                )
        
        return frameworks
    
    def _search_imports(
        self,
        patterns: List[str],
        language: Language
    ) -> List[str]:
        """Search for import patterns in source files"""
        # Get appropriate file extensions
        extensions = {
            Language.PYTHON: [".py"],
            Language.JAVASCRIPT: [".js", ".jsx", ".mjs"],
            Language.TYPESCRIPT: [".ts", ".tsx"],
            Language.JAVA: [".java"],
            Language.GO: [".go"],
        }.get(language, [])
        
        evidence = []
        files_checked = 0
        max_files = 50  # Limit search for performance
        
        for root, dirs, files in os.walk(self.repo_path):
            # Skip non-source directories
            dirs[:] = [d for d in dirs if d not in {
                "node_modules", ".git", "venv", "dist", "build"
            }]
            
            for filename in files:
                ext = os.path.splitext(filename)[1].lower()
                if ext not in extensions:
                    continue
                
                file_path = os.path.join(root, filename)
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read(10000)  # Read first 10KB
                        
                        for pattern in patterns:
                            if re.search(pattern, content):
                                relative_path = os.path.relpath(file_path, self.repo_path)
                                evidence.append(f"Import in {relative_path}")
                                return evidence  # Found it, exit early
                except (OSError, IOError):
                    continue
                
                files_checked += 1
                if files_checked >= max_files:
                    break
            
            if files_checked >= max_files:
                break
        
        return evidence
    
    def _is_monorepo(self) -> bool:
        """Detect if this is a monorepo"""
        # Check for common monorepo patterns
        monorepo_indicators = [
            "lerna.json",
            "pnpm-workspace.yaml",
            "nx.json",
        ]
        
        for indicator in monorepo_indicators:
            if self._file_exists(indicator):
                return True
        
        # Check for packages/ or apps/ directory structure
        has_packages = os.path.isdir(os.path.join(self.repo_path, "packages"))
        has_apps = os.path.isdir(os.path.join(self.repo_path, "apps"))
        
        return has_packages or has_apps
    
    def _detect_architecture_type(self) -> str:
        """Detect if monolith or microservices"""
        # Check for Dockerfile or docker-compose
        has_docker = self._file_exists("Dockerfile")
        has_compose = self._file_exists("docker-compose.yml") or \
                      self._file_exists("docker-compose.yaml")
        
        # Check for Kubernetes configs
        has_k8s = os.path.isdir(os.path.join(self.repo_path, "k8s")) or \
                  os.path.isdir(os.path.join(self.repo_path, "kubernetes"))
        
        # If multiple services detected, likely microservices
        if has_k8s:
            return "microservices"
        
        if has_compose:
            # Parse docker-compose to count services
            # For now, assume microservices if docker-compose exists
            return "microservices"
        
        if has_docker and self._is_monorepo():
            return "microservices"
        
        return "monolith"
    
    def _file_exists(self, filename: str) -> bool:
        """Check if file exists in repo root"""
        return os.path.isfile(os.path.join(self.repo_path, filename))
    
    def _add_evidence(self, category: str, evidence: any) -> None:
        """Add evidence to detection result"""
        if category not in self.evidence:
            self.evidence[category] = []
        
        if isinstance(evidence, list):
            self.evidence[category].extend(evidence)
        else:
            self.evidence[category].append(evidence)


def detect_language_and_frameworks(repo_path: str) -> DetectionResult:
    """
    Convenience function to detect language and frameworks.
    
    Args:
        repo_path: Path to repository
        
    Returns:
        DetectionResult with complete analysis
    """
    detector = LanguageDetector(repo_path)
    return detector.detect()
