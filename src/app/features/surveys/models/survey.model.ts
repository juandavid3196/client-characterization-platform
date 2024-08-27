export interface Survey {
    id: string,
    title: string,
    questions: any[],
    description?:  string,
    state:string,
    date_creation : string,
    created_by?:number,
    updated_date:string,
    updated_by?:string,
    link: string,
}