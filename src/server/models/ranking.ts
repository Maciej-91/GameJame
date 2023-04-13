import { model, Schema } from 'mongoose';

type RankingType = {
    name: string,
    key: string,
    score: number
}

const RankingSchema = new Schema<RankingType>({
    name: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
    score: { type: Number, required: true, default: 0 }
}, { _id: false, versionKey: false });

const Ranking = model<RankingType>("ranking", RankingSchema);

export default Ranking;