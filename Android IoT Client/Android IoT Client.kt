import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.widget.TextView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody

class MainActivity : Activity(), SensorEventListener {
    private lateinit var sensorManager: SensorManager
    private var temperatureSensor: Sensor? = null
    private lateinit var temperatureTextView: TextView

    private val client = OkHttpClient()
    private val serverUrl = "http://<your-vm-ip>:8069/iot"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        temperatureTextView = findViewById(R.id.temperatureTextView)
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        temperatureSensor = sensorManager.getDefaultSensor(Sensor.TYPE_AMBIENT_TEMPERATURE)
    }

    override fun onResume() {
        super.onResume()
        temperatureSensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    override fun onPause() {
        super.onPause()
        sensorManager.unregisterListener(this)
    }


    override fun onSensorChanged(event: SensorEvent) {
        if (event.sensor.type == Sensor.TYPE_AMBIENT_TEMPERATURE) {
            val temperature = event.values[0]
            temperatureTextView.text = "Temperature: ${temperature}°C"
            sendDataToServer(temperature)
        }
    }


    private fun sendDataToServer(temperature: Float) {
       CoroutineScope(Dispatchers.IO).launch{
           try {
               val mediaType = "application/json; charset=utf-8".toMediaType()
               val json = "{\"temperature\": $temperature}"
               val requestBody = json.toRequestBody(mediaType)
               val request = Request.Builder()
                  .url(serverUrl)
                    .post(requestBody)
                    .build()

              val response = client.newCall(request).execute()
              if (response.isSuccessful){
                 println("Data sent successfully")
              } else {
                println("Failed to send data with code: ${response.code}")
              }


            } catch (e: Exception) {
                println("Error: ${e.message}")
           }
        }
    }


    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Do nothing
    }

}