<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuthResource;
use App\Http\Resources\MessageResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller {
    /**
     * Register a new user
     */
    public function register(Request $request) {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return (new AuthResource($user, $token, 'User registered successfully'))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Login user
     */
    public function login(Request $request) {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke all existing tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return new AuthResource($user, $token, 'Login successful');
    }

    /**
     * Logout user (Revoke the token)
     */
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return new MessageResource('Logged out successfully');
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request) {
        return new UserResource($request->user());
    }

    /**
     * Logout from all devices (Revoke all tokens)
     */
    public function logoutAll(Request $request) {
        $request->user()->tokens()->delete();

        return new MessageResource('Logged out from all devices successfully');
    }
}
