// import FC from react
import { type FC, useState, useContext, type FormEvent } from "react";

//import hook useNavigate from react router
import { useNavigate } from "react-router";

//import custom  hook useLogin from hooks
import { useLogin } from "../../hooks/auth/useLogin";

//import js-cookie
import Cookies from "js-cookie";

//import context
import { AuthContext } from "../../context/auth/AuthContext";
import type { AxiosError } from "axios";

//interface for validation errors
interface ValidationErrors {
  [key: string]: string[];
}

interface ErrorResponse {
  message: string;
  data?: {
    [key: string]: string[];
  };
}

interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export const Login: FC = () => {
  //initialize navigate
  const navigate = useNavigate();

  //initialize useLogin
  const { mutate, isPending } = useLogin();

  //destruct auth context "setIsAuthenticated"
  const { setIsAuthenticated } = useContext(AuthContext)!;

  //define state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //define state for errors
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Handle submit form
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    // Call the login mutation
    mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (data: LoginResponse) => {
          //set token to cookie
          Cookies.set("token", data.data.token);

          //set user to cookie
          Cookies.set(
            "user",
            JSON.stringify({
              id: data.data.user.id,
              name: data.data.user.name,
              email: data.data.user.email,
            }),
          );

          //set isAuthenticated to true
          setIsAuthenticated(true);

          // Redirect to dashboard page
          navigate("/admin/dashboard");
        },
        onError: (error: Error) => {
          // Type guard to check if error is AxiosError
          if (error && "isAxiosError" in error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            const response = axiosError?.response?.data;
            const status = axiosError?.status;

            // reset error
            setErrors({});

            // VALIDATION ERROR (422)
            if (status === 422 && response?.data) {
              setErrors(response.data);
              return;
            }

            // LOGIN FAILED (401)
            if (status === 401 && response) {
              setErrors({
                email: [response?.message],
              });
              return;
            }
          }
        },
      },
    );
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-body">
            <h4 className="fw-bold text-center">LOGIN</h4>
            <hr />
            <form onSubmit={handleLogin}>
              <div className="form-group mb-3">
                <label className="mb-1 fw-bold">Email Address</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Email"
                />
                {errors.email && (
                  <div className="alert alert-danger mt-2 rounded-4">
                    {errors.email[0]}
                  </div>
                )}
              </div>

              <div className="form-group mb-3">
                <label className="mb-1 fw-bold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Password"
                />
                {errors.password && (
                  <div className="alert alert-danger mt-2 rounded-4">
                    {errors.password[0]}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-4"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "LOGIN"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
