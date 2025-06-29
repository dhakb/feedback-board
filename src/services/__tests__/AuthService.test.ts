import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";


jest.mock("bcrypt");
jest.mock("jsonwebtoken");

import { AuthServiceImpl } from "../AuthServiceImpl";

const mockUser: User = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  passwordHash: "hashed-password",
  role: "USER",
  createdAt: new Date()
};

const userRepoRepository: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn()
};

describe("AuthService", () => {
  const service = new AuthServiceImpl(userRepoRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      userRepoRepository.findByEmail.mockResolvedValue(null);
      userRepoRepository.create.mockResolvedValue(mockUser);

      const result = await service.register("Test User", "test@example.com", "password123");

      expect(userRepoRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(userRepoRepository.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role
      });
    });

    it("should throw error if email is already taken", async () => {
      userRepoRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register("Test User", "test@example.com", "password123")
      ).rejects.toThrow("Email already in use");
    });
  });

  describe("login", () => {
    it("should login successfully with correct credentials", async () => {
      userRepoRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock-jwt-token");

      const result = await service.login("test@example.com", "password123");

      expect(userRepoRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(result.token).toBe("mock-jwt-token");
      expect(result.user).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role
      });
    });

    it("should throw error if password is incorrect", async () => {
      userRepoRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login("test@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error if user not found", async () => {
      userRepoRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login("missing@example.com", "password123")
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("verifyToken", () => {
    it("should decode and return user data from token", () => {
      const payload = {userId: "user-1", role: "USER"};
      (jwt.verify as jest.Mock).mockReturnValue(payload);

      const result = service.verifyToken("mock-token");

      expect(jwt.verify).toHaveBeenCalledWith("mock-token", expect.any(String));
      expect(result).toEqual(payload);
    });
  });
});
