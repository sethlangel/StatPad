'use client'

import { useAuth } from "../../../hooks/useAuth";

type Stats = {
    name: string,
    id: string,
    error_count: number
}
export default function StatsTable(props: {data: Stats[]}) {
    
    const auth = useAuth();

    return (
        <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full divide-y divide-gray-300 dark:divide-gray-700 rounded-lg">
                <thead className="statpad-gradient text-base-100">
                    <tr>
                        {/* <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        >
                            Rank
                        </th> */}
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                        >
                            Total Error Count
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-base-100 divide-y divide-gray-200 dark:divide-gray-700">
                    {props.data.map(({ id, name, error_count }) => (
                        <tr key={name} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${id == auth.session?.user.id && "bg-pink-600 text-base-100"} `}>
                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{error_rank}</td> */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                {error_count.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
