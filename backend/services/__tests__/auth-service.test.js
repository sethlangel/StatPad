import { AuthService } from '../auth-service.js';

describe('AuthService', () => {
  let authService;
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        getUser: jest.fn()
      }
    };
    authService = new AuthService(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a user with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { id: 'user-123', email };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const result = await authService.signUp(email, password);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({ email, password });
      expect(result).toEqual({
        message: "User created successfully",
        user: mockUser
      });
    });

    it('should throw error when email is missing', async () => {
      await expect(authService.signUp(null, 'password123'))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error when password is missing', async () => {
      await expect(authService.signUp('test@example.com', null))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error when both email and password are missing', async () => {
      await expect(authService.signUp(null, null))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error when supabase returns an error', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'User already exists' }
      });

      await expect(authService.signUp(email, password))
        .rejects.toThrow('User already exists');
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { id: 'user-123', email };
      const mockSession = { access_token: 'token-123' };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      const result = await authService.signIn(email, password);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({ email, password });
      expect(result).toEqual({
        message: "Login successful",
        user: mockUser,
        session: mockSession
      });
    });

    it('should throw error when email is missing', async () => {
      await expect(authService.signIn(null, 'password123'))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error when password is missing', async () => {
      await expect(authService.signIn('test@example.com', null))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error when supabase returns an error', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' }
      });

      await expect(authService.signIn(email, password))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('getUser', () => {
    it('should successfully get user with valid token', async () => {
      const token = 'valid-token';
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const result = await authService.getUser(token);

      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockUser);
    });

    it('should throw error when token is invalid', async () => {
      const token = 'invalid-token';

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' }
      });

      await expect(authService.getUser(token))
        .rejects.toThrow('Invalid or expired token');
    });

    it('should throw error when user is null', async () => {
      const token = 'valid-token';

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      });

      await expect(authService.getUser(token))
        .rejects.toThrow('Invalid or expired token');
    });
  });
});
