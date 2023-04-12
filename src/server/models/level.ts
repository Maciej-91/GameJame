import { model, Schema } from 'mongoose';

type LevelType = {
    name: string,
    frames: LevelFrameType[]
};

type LevelFrameType = Obstacles[];

type Obstacles = {
    x: number,
    y: number,
};

const ObstaclesSchema = new Schema<Obstacles>({
    x: { type: Number, required: true },
    y: { type: Number, required: true }
}, { _id: false, versionKey: false });

const LevelFrameSchema = new Schema<LevelFrameType>([ObstaclesSchema], { _id: false, versionKey: false });

const LevelSchema = new Schema<LevelType>({
    name: { type: String, required: true, unique: true },
    frames: [LevelFrameSchema]
}, { versionKey: false });

const Level = model<LevelType>("levels", LevelSchema);

export default Level;