export interface Survey {
    id: number,
    title: string,
    questions: any[],
    description?:  string,
    state:string,
    date_creation : string,
    created_by?:number,
    updated_date:string,
    updated_by?:string

}