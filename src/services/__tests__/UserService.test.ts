import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserServiceImpl } from "../UserService";


const mockUser: User = {
  id: "user-1",
  name: "Test User",
  email: "user-test@test.com",
  passwordHash: "hashed-password",
  role: "USER",
  createdAt: new Date()
};

describe("UserService", () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let userService: UserServiceImpl;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    userService = new UserServiceImpl(userRepository);
  });

  it("should update permitted user fields and return updated user", async () => {
    const input = {
      name: "Updated Name"
    };

    userRepository.update.mockResolvedValue({...mockUser, ...input});

    const user = await userService.updateUserProfile("user-1", "user-test@test.com", input);

    expect(userRepository.update).toHaveBeenCalledWith("user-test@test.com", input);
    expect(user.name).toBe(input.name);
  });
});