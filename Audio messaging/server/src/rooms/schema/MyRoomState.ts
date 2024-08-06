import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";


// show the connections
// not important 
export class Player extends Schema {
  // 是否在錄音
  @type("boolean") pushing = false;
}

export class MyRoomState extends Schema {
  // 所有client的資料
  @type({ map: Player }) players = new MapSchema<Player>();
}
