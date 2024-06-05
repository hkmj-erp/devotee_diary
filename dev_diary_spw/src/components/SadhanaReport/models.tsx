export type SadhanaParameterData = {
    parameter: string;
    count: number;
    points: number;
    sick: number;
    authorised_service: number;
};

export type SadhanaReportRow = {
    devotee: string;
    devotee_initial: string;
    parameters: SadhanaParameterData[];
    parent: string;
    percentage: number;
    total: number;
    total_as: number;
    total_days: number;
    total_sick: number;
};