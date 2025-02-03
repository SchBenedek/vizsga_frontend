import { Assignment } from "./types";

class SortCfg 
{
    key?: keyof Assignment
    direction?: 'asc' | 'desc'
    constructor(key: keyof Assignment, direction: "asc" | "desc") {
        this.key = key
        this.direction = direction
    }
}
export const sortAssignments=(key: keyof Assignment, direction: "asc" | "desc", toSort: Assignment[])=>{
    const sortedAssignments=[...toSort].sort((a, b)=>{
        if(a[key]<b[key]){
            return direction==="asc" ? -1 : 1;
        }
        if(a[key]>b[key]){
            return direction==="asc" ? 1 : -1;
        }
        return 0;
    });
    const cfg = new SortCfg(key, direction)
    return({sortedAssignments, cfg});
    
};