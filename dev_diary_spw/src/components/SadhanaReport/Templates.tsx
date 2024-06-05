import { VStack, HStack, Text, Badge, Circle, Center, Button } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { SadhanaParameterData, SadhanaReportRow } from "./models";
import { Link } from 'react-router-dom';

export function DevoteeTemplate(props: SadhanaReportRow, public_key: string): any {
    return (
        // sadhana_individual/:public_key/:devotee
        <VStack align="left">
            <Text fontSize="lg">{props.devotee_initial}<Link to={'/sadhana_individual/' + public_key + '/' + props.devotee_initial}
                target="_blank" rel="noopener noreferrer"
            >
                <ExternalLinkIcon mx='2px' />
            </Link></Text>

            <Text fontSize="sm" as="em">
                {props.devotee}
            </Text>
        </VStack>
    )
}

export function ParameterTemplate(props: SadhanaParameterData): any {
    return (

        <VStack align="center">


            <Text fontSize="md">{props.count}</Text>

            <HStack>
                <Center w='20px' h='20px' bg='cyan.200' color='black'>
                    {props.authorised_service}
                </Center>
                <Center w='20px' h='20px' bg='blue.700' color='white'>
                    {props.sick}
                </Center>
            </HStack>
        </VStack>
    )
}