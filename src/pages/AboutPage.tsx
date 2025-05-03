import React from 'react';
import { Users, Star, Flag, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="bg-primary-500 py-12 md:py-24 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-6">
            About Yummy
          </h1>
          <p className="text-primary-50 max-w-2xl mx-auto text-base md:text-lg lg:text-xl">
            Your trusted guide to discovering Addis Ababa's vibrant food scene
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4 md:mb-6">
              Our Mission
            </h2>
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
              At Yummy, we're passionate about connecting food lovers with the best culinary experiences in Addis Ababa. 
              Our mission is to showcase the rich diversity of Ethiopian cuisine while celebrating the international 
              influences that make Addis Ababa a unique food destination.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            <div className="bg-neutral-50 p-4 md:p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
              </div>
              <h3 className="font-display font-semibold text-lg md:text-xl mb-2 md:mb-3 text-neutral-900">
                Quality First
              </h3>
              <p className="text-sm md:text-base text-neutral-600">
                We personally visit and review restaurants to ensure we only recommend the best options for our users.
              </p>
            </div>
            
            <div className="bg-neutral-50 p-4 md:p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flag className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
              </div>
              <h3 className="font-display font-semibold text-lg md:text-xl mb-2 md:mb-3 text-neutral-900">
                Cultural Celebration
              </h3>
              <p className="text-sm md:text-base text-neutral-600">
                We highlight the cultural significance of Ethiopian cuisine and promote authentic dining experiences.
              </p>
            </div>
            
            <div className="bg-neutral-50 p-4 md:p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
              </div>
              <h3 className="font-display font-semibold text-lg md:text-xl mb-2 md:mb-3 text-neutral-900">
                Community Driven
              </h3>
              <p className="text-sm md:text-base text-neutral-600">
                Our reviews come from real diners who share their honest experiences to help others find great food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6 text-center">
              Our Story
            </h2>
            
            <div className="prose prose-lg max-w-none text-neutral-700">
              <p className="mb-4">
                Yummy was founded in 2023 by a group of food enthusiasts who were passionate about Ethiopian cuisine and wanted to create a platform that would showcase the best of Addis Ababa's food scene.
              </p>
              
              <p className="mb-4">
                What started as a small blog reviewing local restaurants has grown into a comprehensive platform that helps thousands of diners discover new culinary experiences every month.
              </p>
              
              <p className="mb-4">
                Our team consists of food critics, photographers, and technology experts who work together to provide accurate, helpful information about restaurants across Addis Ababa.
              </p>
              
              <p className="mb-4">
                We believe that food is more than just sustenance—it's a way to connect with culture, community, and tradition. Through Yummy, we aim to help people forge these connections while enjoying delicious meals.
              </p>
              
              <p>
                Today, we're proud to be the leading food review platform in Addis Ababa, trusted by locals and visitors alike to guide their dining decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-8 md:mb-10 text-center">
            Meet Our Team
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="mb-4 relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary-500" />
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg md:text-xl text-neutral-900">Selamawit Wale</h3>
              <p className="text-primary-500 mb-2">Founder & CEO</p>
              <p className="text-sm md:text-base text-neutral-600">Food critic and entrepreneur with a passion for Ethiopian cuisine</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary-500" />
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg md:text-xl text-neutral-900">Israel Theodros</h3>
              <p className="text-primary-500 mb-2">Head of Reviews</p>
              <p className="text-sm md:text-base text-neutral-600">Former chef with 15 years of experience in fine dining restaurants</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary-500" />
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg md:text-xl text-neutral-900">Abel Tewodros</h3>
              <p className="text-primary-500 mb-2">Photography Director</p>
              <p className="text-sm md:text-base text-neutral-600">Food photographer specializing in capturing Ethiopian cuisine</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary-500" />
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg md:text-xl text-neutral-900">Yonas Lake</h3>
              <p className="text-primary-500 mb-2">Tech Lead</p>
              <p className="text-sm md:text-base text-neutral-600">Software engineer with a background in web development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 bg-accent-300">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-8 md:mb-10">
            Our Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-display font-semibold text-lg md:text-xl mb-3">Authenticity</h3>
              <p className="text-neutral-700 text-sm md:text-base">
                We value genuine experiences and honest reviews that truly reflect the quality of restaurants.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-display font-semibold text-lg md:text-xl mb-3">Diversity</h3>
              <p className="text-neutral-700 text-sm md:text-base">
                We celebrate the rich variety of culinary traditions that make Addis Ababa's food scene special.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-display font-semibold text-lg md:text-xl mb-3">Community</h3>
              <p className="text-neutral-700 text-sm md:text-base">
                We believe in supporting local restaurants and fostering connections between diners and food creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 md:mb-6">
            Join Our Food Community
          </h2>
          <p className="text-primary-50 max-w-2xl mx-auto mb-6 md:mb-8 text-base md:text-lg">
            Discover the best restaurants in Addis Ababa and share your own experiences
          </p>
          <Link 
            to="/restaurants" 
            className="inline-block bg-white text-primary-500 px-6 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-medium hover:bg-neutral-100 transition-colors"
          >
            Explore Restaurants
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;