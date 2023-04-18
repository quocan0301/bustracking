export class Location{
    constructor(Name,Longitude,Latitude){
        this.Name=Name;//string
        this.Longitude=Longitude;//number
        this.Latitude=Latitude;//number
    }
    FromObj(Obj){
        this.Name=Obj.Name;//string
        this.Longitude=Obj.Longitude;//number
        this.Latitude=Obj.Latitude;//number
    }
    // ToObj(){
    //     return {
    //         Name: this.Name,
    //         Longitude: this.Longitude,
    //         Latitude: this.Latitude,   
    //     }     
    // }
}

export class Bus{
    constructor(EntityId,licence_plate,Location,timeArrive){
        this.EntityId=EntityId;//string
        this.licence_plate=licence_plate;//string
    }
    FromObj(Obj){
        this.EntityId=Obj.EntityId;//string
        this.licence_plate=Obj.licence_plate;//string
    }    
    // ToObj(){
    //     return {
    //         EntityId: this.EntityId,
    //         licence_plate: this.licence_plate,
    //     }
    // }
}

export class Schedule{
    constructor(WalkStages=null,BusStages=null,buses=null,GeneralPredictTime=null, SpecificPredictTimes=null,BusLocations=null,ToStationTimes=null, GeneralDistance=null, SpecificDistances=null){
        this.WalkStages=WalkStages;
        this.BusStages=BusStages;
        this.buses=buses;
        this.GeneralPredictTime=GeneralPredictTime;
        this.GeneralDistance=GeneralDistance;
        this.SpecificDistances=SpecificDistances;
        this.SpecificPredictTimes=SpecificPredictTimes;
        this.BusLocations=BusLocations;
        this.ToStationTimes=ToStationTimes;
    }
    FromObj(Obj){
        if(Obj.WalkStages)
            this.WalkStages=Obj.WalkStages
            .map(walkStage=>{
                const temp= new WalkStage(null, null);
                return temp.FromObj(walkStage)
            });
        
        if(Obj.BusStages)
            this.BusStages=Obj.BusStages
            .map(busStage=>{
                const temp= new BusStage(null, null);
                return temp.FromObj(busStage)
            });

        if(Obj.buses)
            this.buses=Obj.buses
            .map(bus=>{
                const temp= new Bus(null, null);
                return temp.FromObj(bus)
            });

        if(Obj.GeneralPredictTime)
            this.GeneralPredictTime=Obj.GeneralPredictTime;

        if(Obj.SpecificPredictTime)
            this.SpecificPredictTimes=Obj.SpecificPredictTimes
            .map(time=>{
                return time;
            });

        if(Obj.BusLocations)
            this.BusLocations= Obj.BusLocations      
            .map(location=>{
                const temp= new Location(null, null);
                return temp.FromObj(location)
            });

        if(Obj.ToStationTimes)
            this.ToStationTimes=Obj.ToStationTimes
            .map(time=>{
                return time;
            });

        
    }
    // ToObj(){
    //     return {
    //         WalkStages: this.WalkStages.ToObj(),
    //         BusStages: this.BusStages.ToObj(),
    //         buses: this.buses.map(bus=>{
    //             return bus.ToObj();
    //         }),
    //         GeneralPredictTime: this.GeneralPredictTime,
    //         SpecificPredictTime: this.SpecificPredictTime,
    //         BusLocations: this.BusLocations.map(location=>{
    //             return location.ToObj();
    //         }),
    //         ToStationTimes: this.ToStationTimes,
    //     }
    // }
}

export class WalkStage{
    constructor(StartPoint, EndPoint){
        this.StartPoint=StartPoint;// obj <Location>
        this.EndPoint=EndPoint;// obj <Location>
    }
    FromObj(Obj){
        this.StartPoint=new Location(null,null,null);
        this.EndPoint=new Location(null,null,null);
        EndPoint.FromObj(Obj.StartPoint);
        this.StartPoint.FromObj(Obj.EndPoint);
    }
    // ToObj(){
    //     return{
    //         StartPoint: this.StartPoint.ToObj(),
    //         EndPoint: this.EndPoint.ToObj(),
    //     }
    // }
}

export class BusStage{
    constructor(listLocation, RouteId){
        this.listLocation=listLocation;
        this.RouteId=RouteId;
    }
    FromObj(Obj){
        this.listLocation=Obj.listLocation
        .map(location=>{
            const temp= new Location(null,null,null);
            return temp.FromObj(location);
        });
        this.RouteId=Obj.RouteId;
    }
    // ToObj(){
    //     return{
    //         listLocation: this.listLocation.map(location=>{
    //             return location.ToObj();
    //         }),
    //         RouteId: this.RouteId,
    //     }
    // }
}

export class MapControlPanel{
    constructor(Callback){
        this.changeState="changed";
        this.typeActivity="no"
        this.StartPoint=null;
        this.EndPoint=null;
        this.currentRoute=null;
        this.Callback=()=>{
            this.changeState="changed";
            Callback();};
    }
    SelectRoute(SelectRoute)
    {
        if(this.changeState=="changing")
            return false;
        this.changeState="changing";
        if(this.currentRoute!=SelectRoute)
        {
            this.currentRoute=SelectRoute;
            if(this.typeActivity=="find" || 
                this.typeActivity=="refind" ||
                this.typeActivity=="reselect")
            {
                this.typeActivity="select";
            }
            else if(this.typeActivity=="select"){
                this.typeActivity="reselect";
            }
        }
    }
    FindRoute(Longitude,Latitude){
        if(this.changeState=="changing")
            return false;
        this.changeState="changing";
        if(this.Longitude!=Longitude ||
            this.Latitude!=Latitude)
        {
            this.Longitude=Longitude;
            this.Latitude=Latitude;
            if(this.typeActivity!="refind")
            {
                this.typeActivity="refind"
            }
            else
            {
                this.typeActivity="find"
            }
        }
    }
    // getChangeState(){return this.changeState}
    // getLong(){return this.Longitude}
    // getLat(){return this.Latitude}
    // getType(){return this.typeActivity}
    // getSelect(){return this.currentRoute}
    // getCallback(){return this.Callback}
    getProps()
    {
        return {
            StartPoint: this.StartPoint,
            EndPoint: this.EndPoint,
            typeActivity: this.typeActivity,
            currentRoute: this.currentRoute,
            Callback: this.Callback,
        };
    }
}