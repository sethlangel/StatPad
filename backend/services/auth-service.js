import { supabase } from "../supabase-client.js";

export class AuthService {
  constructor(supabaseClient = supabase) {
    this.supabase = supabaseClient;
  }

  async signUp(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: "User created successfully",
      user: data.user
    };
  }

  async signIn(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: "Login successful",
      user: data.user,
      session: data.session
    };
  }

  async getUser(token) {
    const { data: { user }, error } = await this.supabase.auth.getUser(token);

    if (error || !user) {
      throw new Error("Invalid or expired token");
    }

    return user;
  }
}
