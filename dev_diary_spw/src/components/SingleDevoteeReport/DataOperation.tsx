import { format, startOfMonth } from "date-fns";
import { SadhanaSingleEntry } from "./models";

function getMonthYearString(date: Date): string {
    return format(date, 'MMM-yy');
}

export function getMonthlyData(data: SadhanaSingleEntry[]) {
    // Group data by month
    const monthlyData: {
        [key: string]: SadhanaSingleEntry
    } = {};
    for (const item of data) {
        const monthYear = getMonthYearString(item.entry_date);
        if (!(monthYear in monthlyData)) {
            monthlyData[monthYear] = {
                entry_date: startOfMonth(item.entry_date),
                devotee: item.devotee,
                parameter: item.parameter,
                points: 0,
                authorised_service: 0,
                sick: 0
            };
        }
        monthlyData[monthYear].points += item.points;
        monthlyData[monthYear].authorised_service += item.authorised_service;
        monthlyData[monthYear].sick += item.sick;
    }
    return Object.values(monthlyData);
}

