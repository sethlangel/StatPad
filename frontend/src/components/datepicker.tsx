export default function DatePicker(props: {
    date: string,
    onDateChange: (date: string) => void,
    label?: string
}) {

    return (
        <div className="w-full flex flex-col items-center justify-center md:w-100">
            {props.label && (
                <h1 className="w-full text-left text-xs md:text-lg">{props.label}</h1>
            )}

            <div className="flex items-center flex-col gap-1 w-full">
                <input
                    type="date"
                    value={props.date}
                    onChange={(e) => props.onDateChange(e.target.value)}
                    className="input w-full"
                />
            </div>
        </div>
    )
}
