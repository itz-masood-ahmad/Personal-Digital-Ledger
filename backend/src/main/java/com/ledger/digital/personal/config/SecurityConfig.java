package com.ledger.digital.personal.config;

import com.ledger.digital.personal.repo.UserRepository;
import com.ledger.digital.personal.security.ApiKeyFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // --- 1. YOUR EXISTING BEANS (Keep them exactly as they were) ---

    @Bean
    public ApiKeyFilter apiKeyFilterBean(UserRepository userRepository) {
        return new ApiKeyFilter(userRepository);
    }

    @Bean
    public FilterRegistrationBean<ApiKeyFilter> apiKeyFilter(ApiKeyFilter filter) {
        FilterRegistrationBean<ApiKeyFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(filter);
        reg.addUrlPatterns("/api/*");
        reg.setOrder(1);
        return reg;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // --- 2. THE SECURITY CHAIN (This allows React to talk to Java) ---

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF so POST requests (like Create Account) don't get blocked
                .csrf(AbstractHttpConfigurer::disable)

                // Enable CORS using the configuration defined below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Allow all requests (Authentication is handled by your ApiKeyFilter)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )

                // Allow H2 Console (Optional)
                .headers(headers -> headers.frameOptions(f -> f.disable()));

        return http.build();
    }

    // --- 3. CORS CONFIGURATION (The "Handshake" Rules) ---

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow your React Frontend specifically
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Allow all standard methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers (Crucial for X-API-KEY)
        configuration.setAllowedHeaders(List.of("*"));

        // Allow credentials (cookies/auth headers)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        // This ignores requests to favicon.ico from hitting the security chain
        return (web) -> web.ignoring().requestMatchers("/favicon.ico");
    }
}