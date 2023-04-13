import { model, Schema } from 'mongoose';

type SpaceshipType = {
    name: string,
    filename: string,
};

const SpaceshipSchema = new Schema<SpaceshipType>({
    name: { type: String, required: true, unique: true },
    filename: { type: String, required: true }
}, { versionKey: false });

const Spaceship = model<SpaceshipType>("spaceships", SpaceshipSchema);

export default Spaceship;