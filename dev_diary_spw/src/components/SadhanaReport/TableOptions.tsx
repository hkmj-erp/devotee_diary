import { SadhanaParameterData } from "./models";

export const sadhanaGroupOptions = {
    columns: ["parent"],
};
export const sadhanaFilterOptions = {
    type: "Excel",
};


export const sadhanaSortComparer = (reference: any, comparer: any) => {

    if (reference.points < comparer.points) {
        return -1;
    }
    if (reference.points > comparer.points) {
        return 1;
    }
    return 0;
};