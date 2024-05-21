// login.interface.ts

export interface LoginRequestDto {
    userName: string;
    password: string;
  }
  
  export interface LoginResponseDto {
    success: boolean;
    token: string;
    expiration: string;
  }
  