import { Flex, Text } from "@chakra-ui/react";
import { DateRangePicker } from "rsuite";
import { DateRange } from "rsuite/esm/DateRangePicker";

interface SadhanaReportFiltersProps {
    dateRange: Date[];
    onDateRangeChange: (value: DateRange | null, event: React.SyntheticEvent<Element, Event>) => void;
}

export const SadhanaReportFilters = ({
    dateRange,
    onDateRangeChange
}: SadhanaReportFiltersProps) => {
    return (
        <>
            <Flex justify="center" align="left" direction="column" mt={4}>

                <Text mb={5}>Date Range</Text>
                <DateRangePicker
                    name="datepicker"
                    size="lg"
                    format="d MMMM yyyy"
                    value={[dateRange[0], dateRange[1]]} onChange={onDateRangeChange} />

            </Flex>
        </>
    );
}
