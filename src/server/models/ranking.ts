import { model, Schema } from 'mongoose';

type RankingType = {
    username: string,
    key: string,
    score: number
}

const RankingSchema = new Schema<RankingType>({
    username: { type: String, required: true },
    key: { type: String, required: true },
    score: { type: Number, required: true, default: 0 }
}, { _id: false, versionKey: false });

const Ranking = model<RankingType>("rankings", RankingSchema);

export default Ranking;