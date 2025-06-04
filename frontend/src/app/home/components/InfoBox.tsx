import { LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export type Data = {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    mainText: string | number,
    bottomText: string
}

type InfoData = {
    title: string,
    href: string,
    data: Data[]
}

export default function InfoBox(props: InfoData) {

    return (
        <div className="w-full h-fit">
            <h1 className="mb-2">{props.title}</h1>

            <div className="h-100 grid grid-cols-2 grid-rows-2 gap-3">
                {props.data.map((info, index) => {
                    return (
                        <div className="bg-base-300 rounded-2xl text-center" key={index}>
                            <div className="flex items-center justify-center"><info.icon className="h-20 w-20 my-5" /></div>
                            <div className="font-bold text-2xl">{info.mainText}</div>
                            <div className="text-gray-300 inline-block align-bottom">{info.bottomText}</div>
                        </div>
                    )
                })}
            </div>
            <a href={props.href}>
                <div className="flex items-center justify-center h-13 bg-base-300 rounded-xl mt-3 cursor-pointer">See More</div>
            </a>
        </div>
    )
}