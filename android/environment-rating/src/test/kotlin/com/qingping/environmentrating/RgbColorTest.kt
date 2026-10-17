package com.qingping.environmentrating

import org.junit.Assert.assertEquals
import org.junit.Test

class RgbColorTest {
    @Test
    fun convertsRgbToAndroidAndHexRepresentations() {
        val color = RgbColor(0xF97316)
        assertEquals(0xF9, color.red)
        assertEquals(0x73, color.green)
        assertEquals(0x16, color.blue)
        assertEquals(0xFFF97316.toInt(), color.argb)
        assertEquals("#F97316", color.hex)
        assertEquals("#F97316", color.toString())
    }

    @Test
    fun padsLeadingZeroes() {
        assertEquals("#0891B2", RgbColor(0x0891B2).hex)
    }
}
