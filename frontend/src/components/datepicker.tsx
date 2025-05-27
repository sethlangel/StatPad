export default function DatePicker(props: {
    date: string,
    onDateChange: (date: string) => void,
    label?: string
}) {

    return (
        <div className="flex flex-col gap-1">
            {props.label && <h1 className="text-xs">{props.label}</h1>}
            <input
                type="date"
                value={props.date}
                onChange={(e) => props.onDateChange(e.target.value)}
                className="input"
            />
        </div>

    )
}