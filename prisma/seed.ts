import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample electronic parts
  const parts = [
    {
      partNumber: 'R-1K-1/4W',
      name: '1K Ohm Resistor',
      description: '1/4 Watt carbon film resistor',
      manufacturer: 'Vishay',
      category: 'Resistor',
      quantity: 100,
      unitPrice: 0.05,
      location: 'A1-B2',
      datasheetUrl: 'https://example.com/datasheet/r-1k.pdf',
      specifications: {
        resistance: '1K Ohm',
        tolerance: '5%',
        powerRating: '1/4W',
        package: 'Axial'
      }
    },
    {
      partNumber: 'C-100uF-25V',
      name: '100µF Electrolytic Capacitor',
      description: '100 microfarad electrolytic capacitor, 25V rating',
      manufacturer: 'Panasonic',
      category: 'Capacitor',
      quantity: 50,
      unitPrice: 0.25,
      location: 'B3-C1',
      datasheetUrl: 'https://example.com/datasheet/c-100uf.pdf',
      specifications: {
        capacitance: '100µF',
        voltage: '25V',
        tolerance: '20%',
        package: 'Radial'
      }
    },
    {
      partNumber: 'IC-555-TIMER',
      name: '555 Timer IC',
      description: 'Classic 555 timer integrated circuit',
      manufacturer: 'Texas Instruments',
      category: 'IC',
      quantity: 25,
      unitPrice: 0.75,
      location: 'D2-E1',
      datasheetUrl: 'https://example.com/datasheet/555.pdf',
      specifications: {
        type: 'Timer',
        pins: 8,
        package: 'DIP-8',
        voltage: '4.5V to 16V'
      }
    },
    {
      partNumber: 'LED-RED-5MM',
      name: 'Red LED 5mm',
      description: 'Standard 5mm red LED',
      manufacturer: 'Kingbright',
      category: 'Diode',
      quantity: 200,
      unitPrice: 0.15,
      location: 'F1-G2',
      specifications: {
        color: 'Red',
        size: '5mm',
        forwardVoltage: '2.1V',
        forwardCurrent: '20mA'
      }
    },
    {
      partNumber: 'CONN-DB9-MALE',
      name: 'DB9 Male Connector',
      description: '9-pin D-sub male connector',
      manufacturer: 'Amphenol',
      category: 'Connector',
      quantity: 15,
      unitPrice: 2.50,
      location: 'H3-I1',
      specifications: {
        type: 'D-sub',
        pins: 9,
        gender: 'Male',
        shell: 'Metal'
      }
    }
  ]

  for (const part of parts) {
    await prisma.electronicPart.create({
      data: part
    })
  }

  console.log('Sample data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
