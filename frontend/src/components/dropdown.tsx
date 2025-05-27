export default function Dropdown(
    options: string[], 
    defaultValue: string, 
    onChange: (val: string) => void) {

    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">Click</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                {options.map((option, index) => 
                <li key={index}>{option}</li>)}
            </ul>
        </div>
    )
}
