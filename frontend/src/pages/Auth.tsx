export default function Auth() {
    return (
        <div className="w-screen h-screen bg-gray-800 flex flex-row justify-center items-center" >
            <div className="">
                <form>
                    <input placeholder="Username" className="bg-white" />
                    <br />
                    <input placeholder="Password" className="bg-white" />
                    <br />
                    <button>Submit</button>
                </form>
            </div>
        </div>
    );
}