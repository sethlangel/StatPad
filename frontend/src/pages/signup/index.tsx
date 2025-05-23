import { useState, FormEvent } from "react";

export default function SignUp() {
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
        const password = e.currentTarget.elements.namedItem("password") as HTMLInputElement;

        const response = await fetch("http://localhost:8000/auth/signup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email.value,
                "password": password.value
            })
        });

        const json = await response.json();

        if (response.status === 201) {
            setResponseMessage("Success! Go to /login to sign in.");
        } else if (response.status === 400) {
            setResponseMessage(json.error);
        } else {
            setResponseMessage(`An error occurred. ${response.status} - ${response.statusText}`);
        }
    }

    return (
        <div className="w-screen h-screen bg-gray-800 flex flex-row justify-center items-center" >
            <div>
                <form onSubmit={handleSubmit} >
                    {/* <input id="fname" placeholder="First Name" className="bg-white" />
                    <br />
                    <input id="lname" placeholder="Last Name" className="bg-white" />
                    <br /> */}
                    <input id="email" placeholder="Email" className="bg-white" />
                    <br />
                    <input id="password" placeholder="Password" className="bg-white" />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
                <a>{responseMessage}</a>
            </div>
        </div>
    );
}