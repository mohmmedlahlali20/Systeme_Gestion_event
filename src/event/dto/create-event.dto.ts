import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';



export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    Title: string;


    @IsNotEmpty()
    @IsString()
    Description: string;


    @IsArray()
    Members: string[];



    @IsDateString()
    Date: string;

    @IsString()
    @IsNotEmpty()
    location: string



}
