import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';



export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    Title: string;


    @IsNotEmpty()
    @IsString()
    Description: string;


    @IsArray()
    Members: string[];



    @IsString()
    Date: Date;

    @IsString()
    @IsNotEmpty()
    location: string



}
