import { IsArray, IsDate, IsDateString, IsMongoId, IsNotEmpty, IsString } from 'class-validator';



export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    Title: string;


    @IsNotEmpty()
    @IsString()
    Description: string;


    @IsArray()
    @IsNotEmpty()
    Members: string[]; 


 
 

}
