import { model, Schema } from 'mongoose';

type PlayerType = {
    username: string,
    totalScore: number,
    totalGames: number,
    levels: LevelType[],
    spaceships: SpaceshipType[]
};

type LevelType = {
    level: number,
    score: number,
    games: number
};

type SpaceshipType = {
    name: string,
    selected?: boolean
};

const LevelSchema = new Schema<LevelType>({
    level: { type: Number, required: true },
    score: { type: Number, required: true, default: 0 },
    games: { type: Number, required: true, default: 0 }
}, { _id: false, versionKey: false });

const SpaceshipSchema = new Schema<SpaceshipType>({
    name: { type: String, required: true },
    selected: { type: Boolean, default: false }
}, { _id: false, versionKey: false });

const PlayerSchema = new Schema<PlayerType>({
    username: { type: String, required: true, unique: true },
    totalScore: { type: Number, required: true, default: 0 },
    totalGames: { type: Number, required: true, default: 0 },
    levels: [LevelSchema],
    spaceships: [SpaceshipSchema]
}, { versionKey: false });

const Player = model<PlayerType>("players", PlayerSchema);

export default Player;