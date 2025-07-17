import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { AuthServiceImpl } from "../auth/AuthServiceImpl";
import { IAuthService } from "../auth/IAuthService";


jest.mock("bcrypt");
jest.mock("jsonwebtoken");


const mockUser = new User({
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  password: "hashed-password",
  role: "USER",
  createdAt: new Date()
});


describe("AuthService", () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let authService: IAuthService;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    authService = new AuthServiceImpl(userRepository);

    jest.resetAllMocks();
  });

  describe("AuthService.register", () => {
    it("should register a new user", async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);

      const createdUser = await authService.register("Test User", "test@example.com", "password123");

      const callArg = userRepository.create.mock.calls[0][0];

      expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(userRepository.create).toHaveBeenCalled();
      expect(callArg).toBeInstanceOf(User);
      expect(createdUser).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role
      });
    });

    it("should throw error if email is already taken", async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.register("Test User", "test@example.com", "password123")
      ).rejects.toThrow("Email already in use");
    });
  });

  describe("login", () => {
    it("should login successfully with correct credentials", async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock-jwt-token");

      const result = await authService.login("test@example.com", "password123");

      expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(result.token).toBe("mock-jwt-token");
      expect(result.user).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role
      });
    });

    it("should throw error if password is incorrect", async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login("test@example.com", "wrong-password")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error if user not found", async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login("missing@example.com", "password123")
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("verifyToken", () => {
    it("should decode and return user data from token", () => {
      const payload = {userId: "user-1", role: "USER"};
      (jwt.verify as jest.Mock).mockReturnValue(payload);

      const result = authService.verifyToken("mock-token");

      expect(jwt.verify).toHaveBeenCalledWith("mock-token", expect.any(String));
      expect(result).toEqual(payload);
    });
  });
});
