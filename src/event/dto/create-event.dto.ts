import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsString } from 'class-validator';



export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    Title: string;


    @IsNotEmpty()
    @IsString()
    Description: string;


    @IsNotEmpty()
    @IsMongoId()
    @IsArray()
    members: string[];


    @IsDate()
    @IsNotEmpty()
    Date: Date


}
