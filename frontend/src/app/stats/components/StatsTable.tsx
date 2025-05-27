'use client'

type Stats = {
    error_name: string,
    total_error_count: number
    error_rank: number
}
export default function StatsTable(props: {data: Stats[]}) {

    return (
        <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full divide-y divide-gray-300 dark:divide-gray-700 rounded-lg">
                <thead className="statpad-gradient text-base-100">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        >
                            Rank
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        >
                            Error Name
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
                    {props.data.map(({ error_name, total_error_count, error_rank }) => (
                        <tr key={error_rank} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{error_rank}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{error_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                {total_error_count.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
