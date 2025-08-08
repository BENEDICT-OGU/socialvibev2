import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GoogleSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (token) {
      // Store token and user data in localStorage (or Context if you're using it)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, email }));

      // Redirect to dashboard or homepage
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return <div className="text-center mt-10 text-gray-700">Logging in with Google...</div>;
}

export default GoogleSuccess;
