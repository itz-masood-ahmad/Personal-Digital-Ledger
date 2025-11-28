# --- STAGE 1: Build the application ---
# We use a Maven image to build your code
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the project files from your computer to the container
COPY pom.xml .
COPY src ./src

# Build the application (skipping tests to save time)
RUN mvn clean package -DskipTests

# --- STAGE 2: Run the application ---
# We use a lightweight Java Runtime (JRE) for the final running state
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built JAR file from the 'build' stage to this stage
# Note: This finds any file ending in .jar in the target folder
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (Spring Boot default)
EXPOSE 8080

# The command to start the app
ENTRYPOINT ["java", "-jar", "app.jar"]