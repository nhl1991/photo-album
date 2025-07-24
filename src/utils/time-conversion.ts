

export function TimeConverter(createdAt: number){
    const elapsed = Date.now() - createdAt;
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;

    if(elapsed > year){
        return `${(elapsed/year).toFixed(0)} ${(elapsed/year) < 2 ? "year" : "years"} ago`;
    }else if(elapsed > day){
        //day
        return `${(elapsed/day).toFixed(0)} ${(elapsed/day) < 2 ? "day" : "days"} ago`;
    }else if(elapsed > hour){
        //hour
        return `${(elapsed/hour).toFixed(0)} ${(elapsed/hour) < 2 ? "hour" : "hours"} ago`;
    }else if(elapsed > minute){
        return `${(elapsed/minute).toFixed(0)} ${elapsed/minute < 2 ? "minute": "minutes"} ago`;
    }else {
        return `${(elapsed/second).toFixed(0)} ${elapsed/second < 2 ? "second": "seconds"} ago`
        }
    

}