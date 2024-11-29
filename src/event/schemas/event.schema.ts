import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";


export type eventDocument = Event & Document


@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true })
    Title: string;

    @Prop({ required: true })
    Description: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: "User" }] })
    members: Types.ObjectId[];

    @Prop({required: true})
    location: string;

    @Prop({ type: String }) 
    Date: string

}

export const EventSchema = SchemaFactory.createForClass(Event);
