export interface StateData {
  districts: string[]
  cities: Record<string, string[]>
}

export const INDIA_LOCATIONS: Record<string, StateData> = {
  'Punjab': {
    districts: ['Amritsar','Ludhiana','Jalandhar','Patiala','Bathinda','Mohali','Hoshiarpur','Gurdaspur','Firozpur','Sangrur','Moga','Pathankot','Fatehgarh Sahib','Nawanshahr','Muktsar','Mansa','Barnala','Rupnagar','Kapurthala','Faridkot','Tarn Taran','Fazilka'],
    cities: {
      'Amritsar': ['Amritsar','Tarn Taran','Majitha','Ajnala'],
      'Ludhiana': ['Ludhiana','Khanna','Samrala','Raikot','Jagraon'],
      'Jalandhar': ['Jalandhar','Phagwara','Nakodar','Shahkot'],
      'Patiala': ['Patiala','Rajpura','Nabha','Samana','Fatehgarh Sahib'],
      'Bathinda': ['Bathinda','Rampura Phul','Mansa','Goniana'],
      'Mohali': ['Mohali','Kharar','Dera Bassi','Zirakpur','Banur'],
      'Hoshiarpur': ['Hoshiarpur','Mukerian','Dasuya','Garhshankar'],
      'Gurdaspur': ['Gurdaspur','Pathankot','Batala','Dhariwal','Dinanagar'],
      'Firozpur': ['Firozpur','Fazilka','Jalalabad','Abohar'],
      'Sangrur': ['Sangrur','Barnala','Sunam','Malerkotla','Dhuri'],
    }
  },
  'Haryana': {
    districts: ['Gurugram','Faridabad','Hisar','Rohtak','Panipat','Karnal','Sonipat','Yamunanagar','Ambala','Bhiwani','Mahendragarh','Jhajjar','Rewari','Sirsa','Fatehabad','Jind','Kaithal','Kurukshetra','Palwal','Nuh','Panchkula','Charkhi Dadri'],
    cities: {
      'Gurugram': ['Gurugram','Sohna','Pataudi','Farukhnagar','Manesar'],
      'Faridabad': ['Faridabad','Ballabhgarh','Palwal','Hodal'],
      'Hisar': ['Hisar','Fatehabad','Sirsa','Uklana'],
      'Rohtak': ['Rohtak','Jhajjar','Bahadurgarh','Beri'],
      'Panipat': ['Panipat','Samalkha','Israna'],
      'Karnal': ['Karnal','Kaithal','Nilokheri','Taraori'],
      'Sonipat': ['Sonipat','Gohana','Kharkhoda','Rai'],
      'Ambala': ['Ambala','Ambala City','Naraingarh','Mullana'],
      'Panchkula': ['Panchkula','Kalka','Morni','Barwala'],
    }
  },
  'Himachal Pradesh': {
    districts: ['Shimla','Kangra','Mandi','Kullu','Solan','Una','Hamirpur','Bilaspur','Chamba','Sirmaur','Kinnaur','Lahaul Spiti'],
    cities: {
      'Shimla': ['Shimla','Rampur','Rohru','Chopal','Nankhari'],
      'Kangra': ['Dharamshala','Palampur','Nurpur','Dehra','Baijnath','Kangra'],
      'Mandi': ['Mandi','Sundernagar','Jogindernagar','Rewalsar'],
      'Kullu': ['Kullu','Manali','Bhuntar','Banjar'],
      'Solan': ['Solan','Baddi','Nalagarh','Kasauli','Parwanoo'],
      'Una': ['Una','Amb','Bangana','Gagret'],
      'Hamirpur': ['Hamirpur','Nadaun','Sujanpur','Barsar'],
      'Bilaspur': ['Bilaspur','Ghumarwin','Swarghat'],
      'Chamba': ['Chamba','Dalhousie','Khajjiar','Churah'],
      'Sirmaur': ['Paonta Sahib','Nahan','Rajgarh','Shillai','Pachhad'],
      'Kinnaur': ['Reckong Peo','Kalpa','Sangla'],
      'Lahaul Spiti': ['Keylong','Kaza','Udaipur'],
    }
  },
  'Delhi': {
    districts: ['Central Delhi','East Delhi','New Delhi','North Delhi','North East Delhi','North West Delhi','Shahdara','South Delhi','South East Delhi','South West Delhi','West Delhi'],
    cities: {
      'Central Delhi': ['Connaught Place','Karol Bagh','Paharganj'],
      'South Delhi': ['Saket','Hauz Khas','Malviya Nagar','Vasant Kunj','Greater Kailash'],
      'West Delhi': ['Janakpuri','Dwarka','Rajouri Garden','Tilak Nagar'],
      'North Delhi': ['Rohini','Pitampura','Model Town','Civil Lines'],
      'North West Delhi': ['Shalimar Bagh','Ashok Vihar','Wazirpur'],
      'East Delhi': ['Laxmi Nagar','Preet Vihar','Vivek Vihar','Patparganj'],
      'North East Delhi': ['Shahdara','Yamuna Vihar','Seemapuri'],
      'South West Delhi': ['Dwarka','Uttam Nagar','Bindapur'],
      'Shahdara': ['Dilshad Garden','Jhilmil','Anand Vihar'],
    }
  },
  'Uttar Pradesh': {
    districts: ['Lucknow','Agra','Kanpur','Varanasi','Allahabad','Ghaziabad','Noida','Meerut','Bareilly','Aligarh','Moradabad','Gorakhpur','Mathura','Firozabad','Jhansi','Saharanpur','Muzaffarnagar','Hapur','Bulandshahr','Rampur'],
    cities: {
      'Lucknow': ['Lucknow','Barabanki','Raebareli','Unnao'],
      'Agra': ['Agra','Mathura','Firozabad','Hathras'],
      'Kanpur': ['Kanpur','Kanpur Dehat','Etawah','Orai'],
      'Varanasi': ['Varanasi','Chandauli','Ghazipur','Jaunpur'],
      'Ghaziabad': ['Ghaziabad','Hapur','Bulandshahr','Pilkhuwa'],
      'Noida': ['Noida','Greater Noida','Dadri','Jewar'],
      'Meerut': ['Meerut','Muzaffarnagar','Hapur','Sardhana'],
      'Gorakhpur': ['Gorakhpur','Deoria','Kushinagar','Basti'],
    }
  },
  'Rajasthan': {
    districts: ['Jaipur','Jodhpur','Kota','Ajmer','Bikaner','Udaipur','Alwar','Bharatpur','Sri Ganganagar','Bhilwara','Sikar','Pali','Barmer','Nagaur','Churu','Dungarpur','Tonk','Sawai Madhopur','Bundi','Jhunjhunu'],
    cities: {
      'Jaipur': ['Jaipur','Sanganer','Chomu','Shahpura','Jobner'],
      'Jodhpur': ['Jodhpur','Pali','Barmer','Sirohi'],
      'Kota': ['Kota','Bundi','Baran','Jhalawar'],
      'Ajmer': ['Ajmer','Kishangarh','Beawar','Pushkar'],
      'Bikaner': ['Bikaner','Sri Ganganagar','Hanumangarh','Churu'],
      'Udaipur': ['Udaipur','Chittorgarh','Dungarpur','Banswara'],
      'Alwar': ['Alwar','Bhiwadi','Behror','Rajgarh'],
    }
  },
  'Maharashtra': {
    districts: ['Mumbai','Pune','Nagpur','Thane','Nashik','Aurangabad','Solapur','Kolhapur','Amravati','Nanded','Sangli','Satara','Raigad','Jalgaon','Akola','Latur','Dhule','Chandrapur','Yavatmal','Osmanabad'],
    cities: {
      'Mumbai': ['Mumbai','Bandra','Andheri','Borivali','Kurla','Thane','Navi Mumbai'],
      'Pune': ['Pune','Pimpri-Chinchwad','Solapur','Satara','Kolhapur'],
      'Nagpur': ['Nagpur','Amravati','Yavatmal','Wardha','Chandrapur'],
      'Thane': ['Thane','Kalyan','Dombivali','Ulhasnagar','Bhiwandi'],
      'Nashik': ['Nashik','Malegaon','Igatpuri','Sinnar'],
      'Aurangabad': ['Aurangabad','Jalna','Beed','Osmanabad'],
    }
  },
  'Karnataka': {
    districts: ['Bangalore','Mysore','Hubli-Dharwad','Mangalore','Belgaum','Gulbarga','Davanagere','Bellary','Bijapur','Shimoga','Tumkur','Raichur','Bidar','Hassan','Udupi','Mandya','Chikkamagaluru','Kolar','Chitradurga'],
    cities: {
      'Bangalore': ['Bangalore','Whitefield','Electronic City','Yelahanka','Hebbal'],
      'Mysore': ['Mysore','Mandya','Hassan','Chamarajanagar'],
      'Hubli-Dharwad': ['Hubli','Dharwad','Gadag','Haveri'],
      'Mangalore': ['Mangalore','Udupi','Puttur','Sullia'],
      'Belgaum': ['Belgaum','Dharwad','Gadag','Bijapur'],
    }
  },
  'Tamil Nadu': {
    districts: ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Vellore','Erode','Thoothukudi','Dindigul','Thanjavur','Kanchipuram','Tiruppur','Cuddalore','Krishnagiri','Dharmapuri','Namakkal','Karur'],
    cities: {
      'Chennai': ['Chennai','Tambaram','Avadi','Ambattur','Tiruvottiyur'],
      'Coimbatore': ['Coimbatore','Tiruppur','Erode','Ooty','Pollachi'],
      'Madurai': ['Madurai','Dindigul','Sivakasi','Virudhunagar'],
      'Tiruchirappalli': ['Tiruchirappalli','Thanjavur','Karur','Ariyalur'],
    }
  },
  'Gujarat': {
    districts: ['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Bhavnagar','Jamnagar','Junagadh','Anand','Mehsana','Nadiad','Bharuch','Morbi','Surendranagar','Amreli','Botad','Dahod'],
    cities: {
      'Ahmedabad': ['Ahmedabad','Gandhinagar','Sanand','Bavla','Dholka'],
      'Surat': ['Surat','Navsari','Valsad','Bharuch','Ankleshwar'],
      'Vadodara': ['Vadodara','Anand','Nadiad','Kheda'],
      'Rajkot': ['Rajkot','Morbi','Gondal','Jetpur','Wankaner'],
    }
  },
  'West Bengal': {
    districts: ['Kolkata','Howrah','Darjeeling','Jalpaiguri','Murshidabad','Bardhaman','Nadia','North 24 Parganas','South 24 Parganas','Hooghly','Malda','Birbhum','Bankura','Purulia','West Midnapore','East Midnapore'],
    cities: {
      'Kolkata': ['Kolkata','Salt Lake','Rajarhat','Dum Dum','Jadavpur'],
      'Howrah': ['Howrah','Uluberia','Bally','Domjur'],
      'Darjeeling': ['Darjeeling','Siliguri','Kalimpong','Kurseong'],
      'Bardhaman': ['Bardhaman','Asansol','Durgapur','Raniganj'],
    }
  },
  'Bihar': {
    districts: ['Patna','Gaya','Muzaffarpur','Bhagalpur','Darbhanga','Purnia','Arrah','Begusarai','Katihar','Munger','Chhapra','Hajipur','Siwan','Motihari','Samastipur','Sitamarhi','Madhubani'],
    cities: {
      'Patna': ['Patna','Hajipur','Danapur','Barh'],
      'Gaya': ['Gaya','Bodh Gaya','Aurangabad','Nawada'],
      'Muzaffarpur': ['Muzaffarpur','Sitamarhi','Motihari','Bettiah'],
    }
  },
  'Madhya Pradesh': {
    districts: ['Bhopal','Indore','Jabalpur','Gwalior','Ujjain','Sagar','Dewas','Satna','Ratlam','Rewa','Chhindwara','Murwara','Singrauli','Burhanpur','Khandwa','Bhind','Morena','Shivpuri'],
    cities: {
      'Bhopal': ['Bhopal','Sehore','Raisen','Vidisha'],
      'Indore': ['Indore','Dewas','Dhar','Ratlam','Ujjain'],
      'Jabalpur': ['Jabalpur','Katni','Narsinghpur','Seoni'],
      'Gwalior': ['Gwalior','Morena','Bhind','Shivpuri'],
    }
  },
  'Telangana': {
    districts: ['Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Mahbubnagar','Nalgonda','Adilabad','Medak','Rangareddy'],
    cities: {
      'Hyderabad': ['Hyderabad','Secunderabad','Cyberabad','LB Nagar','Kukatpally','Gachibowli'],
      'Warangal': ['Warangal','Hanamkonda','Karimnagar','Khammam'],
      'Nizamabad': ['Nizamabad','Kamareddy','Armoor'],
    }
  },
  'Andhra Pradesh': {
    districts: ['Visakhapatnam','Vijayawada','Guntur','Nellore','Kurnool','Rajahmundry','Kakinada','Tirupati','Anantapur','Kadapa','Eluru','Ongole','Hindupur','Proddatur'],
    cities: {
      'Visakhapatnam': ['Visakhapatnam','Bheemunipatnam','Anakapalle'],
      'Vijayawada': ['Vijayawada','Guntur','Tenali','Mangalagiri'],
      'Tirupati': ['Tirupati','Chittoor','Madanapalle','Puttur'],
    }
  },
  'Kerala': {
    districts: ['Thiruvananthapuram','Kochi','Kozhikode','Thrissur','Kollam','Kannur','Alappuzha','Palakkad','Malappuram','Kottayam','Idukki','Wayanad','Pathanamthitta','Kasaragod'],
    cities: {
      'Kochi': ['Kochi','Aluva','Thrippunithura','Kalamassery','Angamaly'],
      'Thiruvananthapuram': ['Thiruvananthapuram','Kollam','Attingal','Neyyattinkara'],
      'Kozhikode': ['Kozhikode','Malappuram','Tirur','Perinthalmanna'],
    }
  },
  'Odisha': {
    districts: ['Bhubaneswar','Cuttack','Rourkela','Brahmapur','Sambalpur','Puri','Balasore','Baripada','Bhadrak','Jeypore'],
    cities: {
      'Bhubaneswar': ['Bhubaneswar','Cuttack','Puri','Khurda'],
      'Rourkela': ['Rourkela','Sundargarh','Sambalpur','Jharsuguda'],
    }
  },
  'Assam': {
    districts: ['Guwahati','Silchar','Dibrugarh','Jorhat','Nagaon','Tinsukia','Tezpur','Bongaigaon','Dhubri','Diphu'],
    cities: {
      'Guwahati': ['Guwahati','Dispur','Narengi','Jalukbari'],
      'Dibrugarh': ['Dibrugarh','Tinsukia','Duliajan','Margherita'],
    }
  },
  'Jharkhand': {
    districts: ['Ranchi','Jamshedpur','Dhanbad','Bokaro','Deoghar','Hazaribagh','Giridih','Ramgarh','Chaibasa'],
    cities: {
      'Ranchi': ['Ranchi','Namkum','Hatia','Kanke'],
      'Jamshedpur': ['Jamshedpur','Adityapur','Jugsalai','Mango'],
      'Dhanbad': ['Dhanbad','Jharia','Sindri','Bokaro'],
    }
  },
  'Uttarakhand': {
    districts: ['Dehradun','Haridwar','Roorkee','Nainital','Haldwani','Rudrapur','Kashipur','Rishikesh','Mussoorie','Almora','Pithoragarh','Tehri','Pauri'],
    cities: {
      'Dehradun': ['Dehradun','Mussoorie','Rishikesh','Vikasnagar'],
      'Haridwar': ['Haridwar','Roorkee','Manglaur','Laksar'],
      'Nainital': ['Nainital','Haldwani','Bhimtal','Ramnagar'],
    }
  },
  'Goa': {
    districts: ['North Goa','South Goa'],
    cities: {
      'North Goa': ['Panaji','Mapusa','Vasco da Gama','Margao','Calangute','Candolim'],
      'South Goa': ['Margao','Vasco','Ponda','Curchorem'],
    }
  },
  'Chhattisgarh': {
    districts: ['Raipur','Bhilai','Bilaspur','Korba','Durg','Rajnandgaon','Raigarh','Ambikapur'],
    cities: {
      'Raipur': ['Raipur','Arang','Abhanpur','Tilda'],
      'Bhilai': ['Bhilai','Durg','Rajnandgaon','Balod'],
      'Bilaspur': ['Bilaspur','Korba','Raigarh','Janjgir'],
    }
  },
  'Tripura': {
    districts: ['West Tripura','South Tripura','North Tripura','Dhalai'],
    cities: {
      'West Tripura': ['Agartala','Badharghat','Mohanpur'],
      'South Tripura': ['Udaipur','Belonia','Sabroom'],
    }
  },
  'Meghalaya': {
    districts: ['East Khasi Hills','West Khasi Hills','Ri Bhoi','Jaintia Hills','Garo Hills'],
    cities: {
      'East Khasi Hills': ['Shillong','Cherrapunji','Mawlai'],
      'Garo Hills': ['Tura','Williamnagar','Baghmara'],
    }
  },
  'Manipur': {
    districts: ['Imphal East','Imphal West','Thoubal','Bishnupur','Churachandpur'],
    cities: {
      'Imphal East': ['Imphal','Porompat','Heingang'],
      'Imphal West': ['Imphal','Lamphelpat','Sagolband'],
    }
  },
  'Nagaland': {
    districts: ['Kohima','Dimapur','Mokokchung','Tuensang','Wokha','Zunheboto'],
    cities: {
      'Kohima': ['Kohima','Chumukedima','Mokokchung'],
      'Dimapur': ['Dimapur','Rangapahar','Nagarjan'],
    }
  },
  'Arunachal Pradesh': {
    districts: ['Itanagar','Naharlagun','Pasighat','Ziro','Bomdila','Tawang'],
    cities: {
      'Itanagar': ['Itanagar','Naharlagun','Nirjuli'],
      'Pasighat': ['Pasighat','Nari','Ruksin'],
    }
  },
  'Mizoram': {
    districts: ['Aizawl','Lunglei','Champhai','Kolasib','Serchhip'],
    cities: {
      'Aizawl': ['Aizawl','Durtlang','Zemabawk'],
      'Lunglei': ['Lunglei','Hnahthial'],
    }
  },
  'Sikkim': {
    districts: ['East Sikkim','West Sikkim','North Sikkim','South Sikkim'],
    cities: {
      'East Sikkim': ['Gangtok','Rangpo','Singtam'],
      'West Sikkim': ['Geyzing','Soreng','Dentam'],
    }
  },
  // Union Territories
  'Jammu & Kashmir': {
    districts: ['Srinagar','Jammu','Anantnag','Baramulla','Sopore','Kathua','Udhampur','Rajouri','Punch','Doda'],
    cities: {
      'Srinagar': ['Srinagar','Budgam','Ganderbal','Bandipora'],
      'Jammu': ['Jammu','Udhampur','Kathua','Samba','Rajouri'],
    }
  },
  'Ladakh': {
    districts: ['Leh','Kargil'],
    cities: {
      'Leh': ['Leh','Nubra','Changthang'],
      'Kargil': ['Kargil','Zanskar','Drass'],
    }
  },
  'Chandigarh': {
    districts: ['Chandigarh'],
    cities: { 'Chandigarh': ['Chandigarh','Manimajra','Panchkula','Mohali'] }
  },
  'Puducherry': {
    districts: ['Puducherry','Karaikal','Mahe','Yanam'],
    cities: {
      'Puducherry': ['Puducherry','Villianur','Ariyankuppam'],
      'Karaikal': ['Karaikal','Thirunallar'],
    }
  },
  'Andaman & Nicobar': {
    districts: ['South Andaman','North Middle Andaman','Nicobar'],
    cities: {
      'South Andaman': ['Port Blair','Aberdeen Bazaar'],
      'North Middle Andaman': ['Diglipur','Rangat'],
    }
  },
  'Lakshadweep': {
    districts: ['Lakshadweep'],
    cities: { 'Lakshadweep': ['Kavaratti','Agatti','Minicoy'] }
  },
  'Dadra & Nagar Haveli and Daman & Diu': {
    districts: ['Dadra & Nagar Haveli','Daman','Diu'],
    cities: {
      'Dadra & Nagar Haveli': ['Silvassa','Amli','Khanvel'],
      'Daman': ['Daman','Vapi'],
      'Diu': ['Diu','Ghoghla'],
    }
  },
}

export const ALL_STATES = Object.keys(INDIA_LOCATIONS)

export function getDistricts(state: string): string[] {
  return INDIA_LOCATIONS[state]?.districts || []
}

export function getCities(state: string, district: string): string[] {
  return INDIA_LOCATIONS[state]?.cities[district] || []
}

export function getAllCitiesInState(state: string): string[] {
  const data = INDIA_LOCATIONS[state]
  if (!data) return []
  return Object.values(data.cities).flat()
}

export function findStateByCity(city: string): string | null {
  for (const [state, data] of Object.entries(INDIA_LOCATIONS)) {
    for (const cities of Object.values(data.cities)) {
      if (cities.includes(city)) return state
    }
  }
  return null
}
