package com.dev.BETQ.controller;

import com.dev.BETQ.config.JwtProperties;
import com.dev.BETQ.dto.request.AuthenRequest;
import com.dev.BETQ.dto.request.RegisterRequest;
import com.dev.BETQ.dto.response.ApiResponse;
import com.dev.BETQ.dto.response.AuthenResponse;
import com.dev.BETQ.dto.response.ResultLogin;
import com.dev.BETQ.dto.response.UserResponse;
import com.dev.BETQ.service.AuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthenController {
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private JwtProperties jwtProperties;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenResponse>> login(@RequestBody AuthenRequest request, HttpServletResponse response) throws Exception {
        ResultLogin result = authenticationService.login(request);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", result.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(result.getRefreshExpire() / 1000)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        AuthenResponse authenResponse = AuthenResponse.builder()
                .accessToken(result.getAccessToken())
                .build();
        ApiResponse<AuthenResponse> apiResponse =
                ApiResponse.<AuthenResponse>builder()
                        .status(200)
                        .message("Đăng nhập thành công")
                        .result(authenResponse)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }


    @PostMapping("/register")
    public ApiResponse<UserResponse>register(@RequestBody RegisterRequest request){
        return ApiResponse.<UserResponse>builder()
                .status(200)
                .message("Tạo user thành công")
                .result(authenticationService.register(request))
                .build();
    }




}
