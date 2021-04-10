import Activity from "../../../models/Activity";
import Direction from "../../../models/Direction";
import Route from "../../../models/Route";

export default (req, res) => {
  console.log("query")
  console.log(req.query)

  res.statusCode = 200;
  res.json(getRoutes());
}

const getRoutes = (): Array<Route> => {
  return [
    {
      name: "Tonbridge walk",
      distance: {
        kilometer: 12,
        mile: 8
      },
      gpx: {
        location: "some/url/somewhere.gpx"
      },
      pdf: {
        location: "some/url/somewhere.pdf"
      },
      centreLocation: {
        latitude: 51.1324,
        longitude: 0.2637
      },
      activity: Activity.Walk,
      direction: Direction.Cicular
    },
    {
      name: "Boxhill walk",
      distance: {
        kilometer: 8,
        mile: 5
      },
      gpx: {
        location: "some/url1/somewhere.gpx"
      },
      pdf: {
        location: "some/url1/somewhere.pdf"
      },
      centreLocation: {
        latitude: 51.2550,
        longitude: 0.3086
      },
      activity: Activity.Walk,
      direction: Direction.Cicular
    }
  ]
}