import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserServiceImpl } from "../UserServiceImpl";
import { ForbiddenError, NotFoundError } from "../../errors/ApiError";


const mockUser: User = {
  id: "user-1",
  name: "Test User",
  email: "user-test@test.com",
  password: "hashed-password",
  role: "USER",
  createdAt: new Date()
};

describe("UserService", () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let userService: UserServiceImpl;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    userService = new UserServiceImpl(userRepository);

    jest.resetAllMocks();
  });

  it("should update permitted user fields and return updated user", async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);

    const input = {
      name: "Updated Name"
    };

    userRepository.update.mockResolvedValue({...mockUser, ...input});

    const user = await userService.updateUserProfile("user-1", "user-test@test.com", input);

    expect(userRepository.update).toHaveBeenCalledWith("user-test@test.com", input);
    expect(user.name).toBe(input.name);
  });

  it("should throw NotFoundError if user doesn't exist", async () => {
    await expect(userService.updateUserProfile("user-2", "user-test@test.com", {name: "Updated name"})).rejects.toThrow(NotFoundError);

    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it("should throw ForbiddenError if user tries to update other user's profile", async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(userService.updateUserProfile("wrong-1", "user-test@test.com", {name: "Updated name"})).rejects.toThrow(ForbiddenError);

    expect(userRepository.update).not.toHaveBeenCalled();
  });
});