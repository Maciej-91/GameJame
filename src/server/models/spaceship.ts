import { model, Schema } from 'mongoose';

type SpaceshipType = {
    name: string,
    selected?: boolean
};

const SpaceshipSchema = new Schema<SpaceshipType>({
    name: { type: String, required: true },
    selected: { type: Boolean, default: false }
}, { versionKey: false });

const Spaceship = model<SpaceshipType>("spaceships", SpaceshipSchema);

export default Spaceship;