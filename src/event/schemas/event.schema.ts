import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


export type eventDocument = Event & Document


@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true })
    Title: string;

    @Prop({ required: true })
    Description: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
    members: mongoose.Schema.Types.ObjectId[];

 

    @Prop({ default: Date.now })
    created_At: Date;

    @Prop({ default: Date.now })
    update_At: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
