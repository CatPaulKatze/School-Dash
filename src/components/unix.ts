export default function unix(unixtime:number) {

    const weekdays:string[] = [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mitwoch",
        "Donnerstag",
        "Freitag",
        "Samstag"
    ]
    const date:Date = new Date(unixtime * 1000);
    const weekday:number = date.getDay()

    const day:number = date.getDate()
    const month:number = date.getMonth() + 1
    const year:number = date.getFullYear()


    return(weekdays[weekday] + " " + day + ". " + month + ". " + year)
}