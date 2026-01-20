package com.eonix.extractor;

import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.AnnotationExpr;
import com.github.javaparser.ast.expr.StringLiteralExpr;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Java static code extractor using JavaParser.
 * Extracts Spring Boot endpoints, JPA entities, and more.
 * 
 * NO AI. Pure AST parsing for HIGH confidence results.
 */
public class JavaExtractor {
    
    public static void main(String[] args) {
        if (args.length == 0) {
            System.err.println("Usage: java JavaExtractor <file.java>");
            System.exit(1);
        }
        
        String filePath = args[0];
        
        try {
            JavaParser javaParser = new JavaParser();
            CompilationUnit cu = javaParser.parse(new FileInputStream(filePath)).getResult().orElse(null);
            
            if (cu == null) {
                System.err.println("Failed to parse file");
                System.exit(1);
            }
            
            JSONObject result = new JSONObject();
            JSONArray nodes = new JSONArray();
            JSONArray edges = new JSONArray();
            
            // Extract endpoints from Spring Boot controllers
            extractSpringEndpoints(cu, filePath, nodes);
            
            // Extract JPA entities
            extractJPAEntities(cu, filePath, nodes);
            
            result.put("nodes", nodes);
            result.put("edges", edges);
            result.put("confidence", "HIGH");
            
            System.out.println(result.toString(2));
            
        } catch (Exception e) {
            System.err.println("Error extracting: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
    
    private static void extractSpringEndpoints(CompilationUnit cu, String filePath, JSONArray nodes) {
        cu.findAll(ClassOrInterfaceDeclaration.class).forEach(classDecl -> {
            // Check if class has @RestController or @Controller annotation
            boolean isController = classDecl.getAnnotations().stream()
                .anyMatch(ann -> ann.getNameAsString().equals("RestController") || 
                                 ann.getNameAsString().equals("Controller"));
            
            if (!isController) {
                return;
            }
            
            // Get base path from @RequestMapping on class
            String basePath = "";
            Optional<AnnotationExpr> requestMapping = classDecl.getAnnotationByName("RequestMapping");
            if (requestMapping.isPresent()) {
                basePath = extractPathFromAnnotation(requestMapping.get());
            }
            
            // Extract methods with HTTP annotations
            final String finalBasePath = basePath;
            classDecl.getMethods().forEach(method -> {
                String httpMethod = null;
                String path = "";
                
                // Check for HTTP method annotations
                for (AnnotationExpr ann : method.getAnnotations()) {
                    String annName = ann.getNameAsString();
                    
                    if (annName.equals("GetMapping")) {
                        httpMethod = "GET";
                        path = extractPathFromAnnotation(ann);
                    } else if (annName.equals("PostMapping")) {
                        httpMethod = "POST";
                        path = extractPathFromAnnotation(ann);
                    } else if (annName.equals("PutMapping")) {
                        httpMethod = "PUT";
                        path = extractPathFromAnnotation(ann);
                    } else if (annName.equals("DeleteMapping")) {
                        httpMethod = "DELETE";
                        path = extractPathFromAnnotation(ann);
                    } else if (annName.equals("PatchMapping")) {
                        httpMethod = "PATCH";
                        path = extractPathFromAnnotation(ann);
                    } else if (annName.equals("RequestMapping")) {
                        // Get method from annotation value
                        httpMethod = "GET"; // default
                        path = extractPathFromAnnotation(ann);
                    }
                }
                
                if (httpMethod != null) {
                    String fullPath = combinePaths(finalBasePath, path);
                    
                    JSONObject endpoint = new JSONObject();
                    endpoint.put("type", "Endpoint");
                    endpoint.put("id", filePath + ":" + method.getNameAsString() + ":" + method.getBegin().get().line);
                    endpoint.put("name", method.getNameAsString());
                    endpoint.put("file_path", filePath);
                    endpoint.put("line_number", method.getBegin().get().line);
                    endpoint.put("method", httpMethod);
                    endpoint.put("path", fullPath);
                    
                    // Extract parameters
                    JSONArray parameters = new JSONArray();
                    method.getParameters().forEach(param -> {
                        JSONObject parameter = new JSONObject();
                        parameter.put("name", param.getNameAsString());
                        parameter.put("type", param.getType().asString());
                        
                        // Determine source from annotations
                        String source = "query";
                        if (param.getAnnotationByName("PathVariable").isPresent()) {
                            source = "path";
                        } else if (param.getAnnotationByName("RequestBody").isPresent()) {
                            source = "body";
                        } else if (param.getAnnotationByName("RequestParam").isPresent()) {
                            source = "query";
                        }
                        parameter.put("source", source);
                        
                        parameters.put(parameter);
                    });
                    
                    endpoint.put("parameters", parameters);
                    endpoint.put("response_type", method.getType().asString());
                    
                    JSONObject metadata = new JSONObject();
                    metadata.put("framework", "Spring Boot");
                    endpoint.put("metadata", metadata);
                    endpoint.put("confidence", "HIGH");
                    
                    nodes.put(endpoint);
                }
            });
        });
    }
    
    private static void extractJPAEntities(CompilationUnit cu, String filePath, JSONArray nodes) {
        cu.findAll(ClassOrInterfaceDeclaration.class).forEach(classDecl -> {
            // Check for @Entity annotation
            boolean isEntity = classDecl.getAnnotations().stream()
                .anyMatch(ann -> ann.getNameAsString().equals("Entity"));
            
            if (!isEntity) {
                return;
            }
            
            String tableName = classDecl.getNameAsString().toLowerCase();
            
            // Check for @Table annotation
            Optional<AnnotationExpr> tableAnn = classDecl.getAnnotationByName("Table");
            if (tableAnn.isPresent()) {
                // Extract table name from annotation
                // This is simplified, real implementation would parse annotation values
                tableName = classDecl.getNameAsString().toLowerCase();
            }
            
            // Extract fields/columns
            JSONArray columns = new JSONArray();
            classDecl.getFields().forEach(field -> {
                // Check if field has @Column annotation
                boolean isColumn = field.getAnnotations().stream()
                    .anyMatch(ann -> ann.getNameAsString().equals("Column") || 
                                     ann.getNameAsString().equals("Id"));
                
                if (isColumn || field.isPublic()) {
                    field.getVariables().forEach(var -> {
                        String columnName = var.getNameAsString();
                        String columnType = field.getCommonType().asString();
                        columns.put(columnName + ":" + columnType);
                    });
                }
            });
            
            JSONObject entity = new JSONObject();
            entity.put("type", "DatabaseModel");
            entity.put("id", filePath + ":" + classDecl.getNameAsString() + ":" + classDecl.getBegin().get().line);
            entity.put("name", classDecl.getNameAsString());
            entity.put("file_path", filePath);
            entity.put("line_number", classDecl.getBegin().get().line);
            entity.put("table_name", tableName);
            entity.put("columns", columns);
            
            JSONObject metadata = new JSONObject();
            metadata.put("framework", "JPA/Hibernate");
            entity.put("metadata", metadata);
            entity.put("confidence", "HIGH");
            
            nodes.put(entity);
        });
    }
    
    private static String extractPathFromAnnotation(AnnotationExpr ann) {
        // Simplified path extraction
        // Real implementation would parse annotation values properly
        String annStr = ann.toString();
        
        // Try to extract string literal
        int start = annStr.indexOf('"');
        int end = annStr.lastIndexOf('"');
        
        if (start != -1 && end != -1 && start < end) {
            return annStr.substring(start + 1, end);
        }
        
        // Try array syntax
        start = annStr.indexOf('{');
        end = annStr.indexOf('}');
        if (start != -1 && end != -1) {
            String arrayContent = annStr.substring(start + 1, end);
            int quoteStart = arrayContent.indexOf('"');
            int quoteEnd = arrayContent.lastIndexOf('"');
            if (quoteStart != -1 && quoteEnd != -1 && quoteStart < quoteEnd) {
                return arrayContent.substring(quoteStart + 1, quoteEnd);
            }
        }
        
        return "";
    }
    
    private static String combinePaths(String basePath, String path) {
        if (basePath.isEmpty()) {
            return path.startsWith("/") ? path : "/" + path;
        }
        if (path.isEmpty()) {
            return basePath.startsWith("/") ? basePath : "/" + basePath;
        }
        
        String combined = basePath + "/" + path;
        combined = combined.replaceAll("/+", "/");
        
        if (!combined.startsWith("/")) {
            combined = "/" + combined;
        }
        
        return combined;
    }
}
