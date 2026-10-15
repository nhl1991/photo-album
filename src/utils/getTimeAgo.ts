

export function getTimeAgo(createdAt: number){
    const elapsed = Date.now() - createdAt;
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;

    if(elapsed > year){
        return `${(elapsed/year).toFixed(0)}년 전`;
    }else if(elapsed > day){
        //day
        return `${(elapsed/day).toFixed(0)}일 전`;
    }else if(elapsed > hour){
        //hour
        return `${(elapsed/hour).toFixed(0)}시간 전`;
    }else if(elapsed > minute){
        return `${(elapsed/minute).toFixed(0)}분 전`;
    }else {
        return `${(elapsed/second).toFixed(0)}초 전`
        }
    

}